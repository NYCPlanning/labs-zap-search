import { Injectable } from "@nestjs/common";
import { CrmService } from "../crm/crm.service";
import {
  all,
  comparisonOperator,
  containsAnyOf,
  overwriteCodesWithLabels
} from "../crm/crm.utilities";
import { transformMilestones } from "../project/_utils/transform-milestones";
import { transformActions } from "../project/_utils/transform-actions";

@Injectable()
export class AssignmentService {
  constructor(private readonly crmService: CrmService) {}

  async getAssignments(contact, tab) {
    const { contactid, fullname } = contact;
    const recodedCbFullName = fullname ? recodeCbFullName(fullname) : "Unknown";
    const queryObject = generateAssignmentsQueryObject(contact);
    const { records: projects } = await this.crmService.queryFromObject(
      "dcp_projects",
      queryObject
    );

    return transformIntoAssignments(
      projects,
      contactid,
      recodedCbFullName,
      fullname
    ).filter(assignment => assignment.tab === tab);
  }
}

// these are keys that will be replaced with their
// labeled values
const FIELD_LABEL_REPLACEMENT_WHITELIST = [
  "dcp_publicstatus",
  "dcp_borough",
  "statuscode",
  "dcp_ulurp_nonulurp",
  "_dcp_keyword_value",
  "dcp_ceqrtype",
  "dcp_applicantrole",
  "_dcp_applicant_customer_value",
  "_dcp_recommendationsubmittedby_value",
  "dcp_communityboardrecommendation",
  "dcp_boroughpresidentrecommendation",
  "dcp_boroughboardrecommendation",
  "dcp_representing",
  "_dcp_milestone_value",
  "_dcp_applicant_customer_value",
  "_dcp_applicantadministrator_customer_value",
  "_dcp_action_value",
  "_dcp_zoningresolution_value",
  "dcp_lupteammemberrole",
  "statecode"
];

// munge projects into user assignments
export function transformIntoAssignments(
  projects,
  contactid,
  recodedCbFullName,
  fullname
) {
  // JANK. This flags dispositions as contact-owned or not. this is needed for 2 steps later
  // in which we provide all dispositions, but tell our app to associate only contact-specific dispositions
  // with the assignment. This happens here because the _dcp_recommendationsubmittedby_value becomes
  // value-mapped by the time we need the original value (id) to check.
  // TODO: find a better way to deal with the wacky wild order in which we transform/value map
  const projectsWithFlaggedDispositions = projects.map(project => {
    const flaggedDispositions = project.dcp_dcp_project_dcp_communityboarddisposition_project.map(
      disposition => {
        const _isContactDisposition =
          disposition._dcp_recommendationsubmittedby_value === contactid;

        return {
          ...disposition,
          _isContactDisposition
        };
      }
    );

    return {
      ...project,
      dcp_dcp_project_dcp_communityboarddisposition_project: flaggedDispositions
    };
  });

  // this needs to happen before value-mapping because transformMilestones requires raw ids
  // of nested related references.
  const projectsWithFixedMilestones = projectsWithFlaggedDispositions.map(
    project => {
      return {
        ...project,
        dcp_dcp_project_dcp_projectmilestone_project: transformMilestones(
          project.dcp_dcp_project_dcp_projectmilestone_project,
          project
        )
      };
    }
  );

  // this happens first bc expanded entities provide labelled properties
  // differently
  // TODO: this is screwing up milestones bc the ids need to be known
  // before they're replaced
  const valueMappedProjects = overwriteCodesWithLabels(
    projectsWithFixedMilestones,
    FIELD_LABEL_REPLACEMENT_WHITELIST
  );

  // retrieve all assignments, inferred from lup team.
  // this maps projects, then maps project lup teams, then flattens
  // 1:1 assignment-to-projectLUPteam
  const assignments = valueMappedProjects
    .map(project => {
      let { dcp_dcp_project_dcp_projectlupteam_project } = project;

      // special handling for projects that do not have dcp_projectlupteam
      // this creates a "fake" lupteam to make downstream logic happy
      if (!dcp_dcp_project_dcp_projectlupteam_project.length) {
        dcp_dcp_project_dcp_projectlupteam_project = [
          {
            dcp_projectlupteamid: `cb-nonteam-${
              project.dcp_projectname
            }-${contactid}`,
            dcp_lupteammemberrole: "CB"
          }
        ];
      }

      return dcp_dcp_project_dcp_projectlupteam_project.map(lupteam => {
        const tab = computeStatusTab(
          project,
          lupteam,
          recodedCbFullName,
          fullname
        );
        const actions = transformActions(
          project.dcp_dcp_project_dcp_projectaction_project
        );
        const milestones = project.dcp_dcp_project_dcp_projectmilestone_project;
        const dispositions =
          project.dcp_dcp_project_dcp_communityboarddisposition_project;
        const participantRoleLookup = {
          BP: "Borough President",
          BB: "Borough Board",
          CB: "Community Board"
        };
        const userDispositions = dispositions
          // filter all dispositions so they're scoped to the user only
          // TODO: value mapping is making this lookup not work right, need to
          // find a better way to provide BOTH orig values and labeled vals
          .filter(
            disposition =>
              disposition._isContactDisposition &&
              disposition.dcp_representing ===
                participantRoleLookup[lupteam.dcp_lupteammemberrole]
          )
          .map(disposition => {
            return { ...disposition, project };
          });

        return {
          ...lupteam,
          tab,
          project: {
            ...project,
            actions,
            milestones,
            // all dispositions regardless of user assignment
            dispositions
          },

          // this has already been transformed above
          // TODO: however, they need to be SCOPED to the user
          milestones,

          // only the users dispositions
          dispositions: userDispositions
        };
      });
    })
    .reduce((acc, curr) => [...acc, ...curr], []);

  return assignments;
}

function recodeCbFullName(fullname) {
  const newBoroAbbrev = fullname
    .replace("MN CB", "M")
    .replace("BX CB", "X")
    .replace("BK CB", "K")
    .replace("QN CB", "Q")
    .replace("SI CB", "R");

  if (newBoroAbbrev.length == 2) {
    const paddedNewBoroAbbrev = `${newBoroAbbrev.slice(
      0,
      1
    )}0${newBoroAbbrev.slice(1)}`;
    return paddedNewBoroAbbrev;
  } else {
    return newBoroAbbrev;
  }
}

function generateAssignmentsQueryObject(contact) {
  const { contactid, fullname } = contact;
  const recodedCbFullName = fullname ? recodeCbFullName(fullname) : "Unknown";
  const DISPLAY_MILESTONE_IDS = [
    "963beec4-dad0-e711-8116-1458d04e2fb8",
    "943beec4-dad0-e711-8116-1458d04e2fb8",
    "763beec4-dad0-e711-8116-1458d04e2fb8",
    "a63beec4-dad0-e711-8116-1458d04e2fb8",
    "923beec4-dad0-e711-8116-1458d04e2fb8",
    "9e3beec4-dad0-e711-8116-1458d04e2fb8",
    "a43beec4-dad0-e711-8116-1458d04e2fb8",
    "863beec4-dad0-e711-8116-1458d04e2fb8",
    "7c3beec4-dad0-e711-8116-1458d04e2fb8",
    "7e3beec4-dad0-e711-8116-1458d04e2fb8",
    "883beec4-dad0-e711-8116-1458d04e2fb8",
    "783beec4-dad0-e711-8116-1458d04e2fb8",
    "aa3beec4-dad0-e711-8116-1458d04e2fb8",
    "823beec4-dad0-e711-8116-1458d04e2fb8",
    "663beec4-dad0-e711-8116-1458d04e2fb8",
    "6a3beec4-dad0-e711-8116-1458d04e2fb8",
    "a83beec4-dad0-e711-8116-1458d04e2fb8",
    "843beec4-dad0-e711-8116-1458d04e2fb8",
    "8e3beec4-dad0-e711-8116-1458d04e2fb8",
    "780593bb-ecc2-e811-8156-1458d04d0698",
    "6c3beec4-dad0-e711-8116-1458d04e2fb8",

    // these are study area entities and
    // TODO: need to also check for study
    // area flag
    "483beec4-dad0-e711-8116-1458d04e2fb8",
    "4a3beec4-dad0-e711-8116-1458d04e2fb8"
  ];
  const MILESTONES_FILTER = all(
    `(not ${comparisonOperator("statuscode", "eq", 717170001)})`,
    containsAnyOf("_dcp_milestone_value", DISPLAY_MILESTONE_IDS, {
      comparisonStrategy: (prop, val) => comparisonOperator(prop, "eq", val)
    })
  );
  const DISPOSITIONS_FILTER = all(
    `(not ${comparisonOperator("statuscode", "eq", 717170001)})`
  );

  return {
    $select:
      "dcp_name,statecode,dcp_applicanttype,dcp_borough,dcp_ceqrnumber,dcp_ceqrtype,dcp_certifiedreferred,dcp_femafloodzonea,dcp_femafloodzoneshadedx,dcp_sisubdivision,dcp_sischoolseat,dcp_projectbrief,dcp_additionalpublicinformation,dcp_projectname,dcp_publicstatus,dcp_projectcompleted,dcp_hiddenprojectmetrictarget,dcp_ulurp_nonulurp,dcp_validatedcommunitydistricts,dcp_bsanumber,dcp_wrpnumber,dcp_lpcnumber,dcp_name,dcp_nydospermitnumber,dcp_lastmilestonedate,_dcp_applicant_customer_value,_dcp_applicantadministrator_customer_value",

    $count: true,

    // todo maybe alias these crm named relationships
    // filters by projects with associations having some connection to contactid
    // OR infers an association through recodedCbFullName (for Noticed)
    $filter: `
      dcp_visibility eq 717170003
      and ((dcp_dcp_project_dcp_communityboarddisposition_project/any
          (o:o/_dcp_recommendationsubmittedby_value eq ${contactid})
        and dcp_dcp_project_dcp_projectlupteam_project/any
          (o:o/statuscode eq 1))
      or (
        (dcp_ulurp_nonulurp eq 717170001 and dcp_publicstatus eq 717170005)
          and contains(dcp_validatedcommunitydistricts, '${recodedCbFullName}')
      ))
    `,

    // TODO: dispositions need these: AND disp.dcp_visibility IN ('General Public', 'LUP') AND disp.statuscode <> 'Deactivated'
    $expand: `
      dcp_dcp_project_dcp_communityboarddisposition_project($filter=${DISPOSITIONS_FILTER}),
      dcp_dcp_project_dcp_projectmilestone_project($filter=${MILESTONES_FILTER};$select=dcp_milestone,dcp_name,dcp_plannedstartdate,dcp_plannedcompletiondate,dcp_actualstartdate,dcp_actualenddate,statuscode,dcp_milestonesequence,dcp_remainingplanneddayscalculated,dcp_remainingplanneddays,dcp_goalduration,dcp_actualdurationasoftoday,_dcp_milestone_value,_dcp_milestoneoutcome_value),
      dcp_dcp_project_dcp_projectaction_project($select=_dcp_action_value,dcp_name,statuscode,statecode,dcp_ulurpnumber,_dcp_zoningresolution_value,dcp_ccresolutionnumber,dcp_spabsoluteurl),
      dcp_dcp_project_dcp_projectbbl_project,
      dcp_dcp_project_dcp_projectlupteam_project($filter=(_dcp_lupteammember_value eq ${contactid}) and (statuscode eq 1))
    `
  };
}

// TODO: finish this — currently defaults to "to review"!
function computeStatusTab(project, lupteam, recodedCbFullName, fullname) {
  const {
    dcp_dcp_project_dcp_communityboarddisposition_project: dispositions
  } = project;

  const participantDispositions = dispositions.filter(
    disposition =>
      ((disposition.dcp_representing === "Borough President" &&
        lupteam.dcp_lupteammemberrole === "BP") ||
        (disposition.dcp_representing === "Borough Board" &&
          lupteam.dcp_lupteammemberrole === "BB") ||
        (disposition.dcp_representing === "Community Board" &&
          lupteam.dcp_lupteammemberrole === "CB")) &&
      disposition._dcp_recommendationsubmittedby_value === fullname
  );

  if (project.statecode === "Inactive") {
    return "archive";
  }

  // REDO: Terrible: mix of labeled/coded.
  // Some values come through here as labeled, not coded, so we look for both the labeled
  // and coded versions
  if (
    (project.dcp_publicstatus === 717170005 ||
      project.dcp_publicstatus === "Noticed") && // Noticed
    (project.dcp_ulurp_nonulurp === 717170001 ||
      project.dcp_ulurp_nonulurp === "ULURP") && // ULURP
    (project.dcp_validatedcommunitydistricts || []).includes(recodedCbFullName)
  ) {
    return "upcoming";
  }

  // TODO: this is sensitive to sort order. we need to revise this!!!
  if (
    participantDispositions.find(
      disposition =>
        // dcp_visibility 717170003 is General Public
        // dcp_visibility 717170004 is LUP
        [717170003, 717170004].includes(disposition.dcp_visibility) &&
        ["Submitted", "Not Submitted"].includes(disposition.statuscode) &&
        ["Inactive"].includes(disposition.statecode)
    )
  ) {
    return "reviewed";
  }

  if (
    participantDispositions.find(
      disposition =>
        // dcp_visibility 717170003 is General Public
        // dcp_visibility 717170004 is LUP
        [717170003, 717170004].includes(disposition.dcp_visibility) &&
        ["Draft", "Saved"].includes(disposition.statuscode) &&
        ["Active"].includes(disposition.statecode)
    )
  ) {
    return "to-review";
  }

  if (
    participantDispositions.find(
      disposition =>
        disposition.dcp_visibility == null &&
        ["Draft"].includes(disposition.statuscode) &&
        ["Active"].includes(disposition.statecode)
    )
  ) {
    return "upcoming";
  }

  return null;
}
