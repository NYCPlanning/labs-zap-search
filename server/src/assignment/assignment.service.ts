import { Injectable } from '@nestjs/common';
import { OdataService, overwriteCodesWithLabels } from '../odata/odata.service';
import {
  all,
  any,
  comparisonOperator,
  containsAnyOf
} from '../odata/odata.module';
import { transformActions } from '../project/_utils/transform-actions';

@Injectable()
export class AssignmentService {
  constructor(
    private readonly dynamicsWebApi: OdataService
  ) {}

  async getAssignments(contactid, tab) {
    const queryObject = generateAssignmentsQueryObject({ contactid });
    const { records: projects } = await this.dynamicsWebApi
      .queryFromObject('dcp_projects', queryObject);

    return transformIntoAssignments(projects, contactid)
      .filter(assignment => assignment.tab === tab);
  }
}

// these are keys that will be replaced with their
// labeled values
const FIELD_LABEL_REPLACEMENT_WHITELIST = [
  'dcp_publicstatus',
  'dcp_borough',
  'statuscode',
  'dcp_ulurp_nonulurp',
  '_dcp_keyword_value',
  'dcp_ceqrtype',
  'dcp_applicantrole',
  '_dcp_applicant_customer_value',
  '_dcp_recommendationsubmittedby_value',
  'dcp_communityboardrecommendation',
  'dcp_boroughpresidentrecommendation',
  'dcp_boroughboardrecommendation',
  'dcp_representing',
  '_dcp_milestone_value',
  '_dcp_applicant_customer_value',
  '_dcp_applicantadministrator_customer_value',
  '_dcp_action_value',
  '_dcp_zoningresolution_value',
  'dcp_lupteammemberrole',
  'dcp_ispublichearingrequired',
  'statecode',
];

// munge projects into user assignments
export function transformIntoAssignments(projects, contactid) {
  // JANK. This flags dispositions as contact-owned or not. this is needed for 2 steps later
  // in which we provide all dispositions, but tell our app to associate only contact-specific dispositions
  // with the assignment. This happens here because the _dcp_recommendationsubmittedby_value becomes
  // value-mapped by the time we need the original value (id) to check.
  // TODO: find a better way to deal with the wacky wild order in which we transform/value map
  const projectsWithFlaggedDispositions = projects.map(project => {
    const flaggedDispositions =
      project.dcp_dcp_project_dcp_communityboarddisposition_project.map(disposition => {
        const _isContactDisposition = disposition._dcp_recommendationsubmittedby_value === contactid;

        return {
          ...disposition,
          _isContactDisposition,
        };
      });

    return {
      ...project,
      dcp_dcp_project_dcp_communityboarddisposition_project: flaggedDispositions,
    }
  });

  // this happens first bc expanded entities provide labelled properties
  // differently
  // TODO: this is screwing up milestones bc the ids need to be known
  // before they're replaced
  const valueMappedProjects = overwriteCodesWithLabels(
    FIELD_LABEL_REPLACEMENT_WHITELIST,
  );

  // retrieve all assignments, inferred from lup team.
  // this maps projects, then maps project lup teams, then flattens
  // 1:1 assignment-to-projectLUPteam
  const assignments = valueMappedProjects.map(project => {
    const { dcp_dcp_project_dcp_projectlupteam_project } = project;

    return dcp_dcp_project_dcp_projectlupteam_project.map(lupteam => {
      const tab = computeStatusTab(project, lupteam);
      const actions = transformActions(project.dcp_dcp_project_dcp_projectaction_project);
      const dispositions = project.dcp_dcp_project_dcp_communityboarddisposition_project;
      const userDispositions = dispositions
        // filter all dispositions so they're scoped to the user only
        // TODO: value mapping is making this lookup not work right, need to
        // find a better way to provide BOTH orig values and labeled vals
        .filter(disposition => disposition._isContactDisposition)
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
          dispositions,
        },

        // this has already been transformed above
        // TODO: however, they need to be SCOPED to the user
        milestones,

        // only the users dispositions
        dispositions: userDispositions,
      }
    });
  })
  .reduce((acc, curr) => [...acc, ...curr], []);

  return assignments;
}

function generateAssignmentsQueryObject(query) {
  const { contactid } = query;
  const DISPOSITIONS_FILTER = all(
    `(not ${comparisonOperator('statuscode', 'eq', 717170001)})`, // not deactivated
  );

  return {
    $select: 'dcp_name,dcp_applicanttype,dcp_borough,dcp_ceqrnumber,dcp_ceqrtype,dcp_certifiedreferred,dcp_femafloodzonea,dcp_femafloodzonecoastala,dcp_femafloodzoneshadedx,dcp_femafloodzonev,dcp_sisubdivision,dcp_sischoolseat,dcp_projectbrief,dcp_projectname,dcp_publicstatus,dcp_projectcompleted,dcp_hiddenprojectmetrictarget,dcp_ulurp_nonulurp,dcp_communitydistrict,dcp_communitydistricts,dcp_validatedcommunitydistricts,dcp_bsanumber,dcp_wrpnumber,dcp_lpcnumber,dcp_name,dcp_nydospermitnumber,dcp_lastmilestonedate,_dcp_applicant_customer_value,_dcp_applicantadministrator_customer_value',

    $count: true,

    // todo maybe alias these crm named relationships
    $filter: `
      dcp_dcp_project_dcp_communityboarddisposition_project/any(o:o/_dcp_recommendationsubmittedby_value eq ${contactid})
        and dcp_dcp_project_dcp_communityboarddisposition_project/any(o:o/statuscode eq 1)
        and dcp_dcp_project_dcp_projectlupteam_project/any(o:o/statuscode eq 1)
    `,

    $expand: `
      dcp_dcp_project_dcp_communityboarddisposition_project($filter=${DISPOSITIONS_FILTER}),
      dcp_dcp_project_dcp_projectmilestone_project;$select=dcp_milestone,dcp_name,dcp_plannedstartdate,dcp_plannedcompletiondate,dcp_actualstartdate,dcp_actualenddate,statuscode,dcp_milestonesequence,dcp_remainingplanneddayscalculated,dcp_remainingplanneddays,dcp_goalduration,dcp_actualdurationasoftoday,_dcp_milestone_value,_dcp_milestoneoutcome_value),
      dcp_dcp_project_dcp_projectaction_project($select=_dcp_action_value,dcp_name,statuscode,statecode,dcp_ulurpnumber,_dcp_zoningresolution_value,dcp_ccresolutionnumber),
      dcp_dcp_project_dcp_projectbbl_project,
      dcp_dcp_project_dcp_projectlupteam_project($filter=(_dcp_lupteammember_value eq ${contactid}) and (statuscode eq 1))
    `,
  };
}

// TODO: finish this — currently defaults to "to review"!
function computeStatusTab(project, lupteam) {
  const {
    dcp_dcp_project_dcp_communityboarddisposition_project: dispositions,
  } = project;

  const participantDispositions = dispositions.filter(
    disposition => disposition.dcp_representing === 'Borough President' && lupteam.dcp_lupteammemberrole === 'BP'
      || disposition.dcp_representing === 'Borough Board' && lupteam.dcp_lupteammemberrole === 'BB'
      || disposition.dcp_representing === 'Community Board' && lupteam.dcp_lupteammemberrole === 'CB'
    );

  if (project.statecode === 'Inactive') {
    return 'archive';
  }

  // TODO: this is sensitive to sort order. we need to revise this!!!
  if (
    participantDispositions.find(disposition =>
      ['General Public', 'LUP'].includes(disposition.dcp_visibility)
      && ['Submitted', 'Not Submitted'].includes(disposition.statuscode)
      && ['Inactive'].includes(disposition.statecode))
    ) {
    return 'reviewed';
  }

  if (
    participantDispositions.find(disposition =>
      ['General Public', 'LUP'].includes(disposition.dcp_visibility)
      && ['Draft', 'Saved'].includes(disposition.statuscode)
      && ['Active'].includes(disposition.statecode))
    ) {
    return 'to-review';
  }

  if (
    participantDispositions.find(disposition =>
      !disposition.dcp_visibility // upcoming if dcp_visibility is null
      && ['Draft'].includes(disposition.statuscode)
      && ['Active'].includes(disposition.statecode))
    ) {
    return 'upcoming';
  }

  return null;
}
