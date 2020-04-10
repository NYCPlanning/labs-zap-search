import { Injectable } from '@nestjs/common';
import { OdataService, overwriteCodesWithLabels } from '../odata/odata.service';
import { 
  extractMeta,
  coerceToNumber,
  coerceToDateString,
  mapInLookup,
  all,
  any,
  comparisonOperator,
  containsString,
  equalsAnyOf,
  containsAnyOf 
} from '../odata/odata.module';
import { transformMilestones } from '../project/_utils/transform-milestones';
import { transformActions } from '../project/_utils/transform-actions';

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

@Injectable()
export class AssignmentService {
  constructor(
    private readonly dynamicsWebApi: OdataService
  ) {}

  async getAssignments(contactid, tab) {
    const queryObject = generateAssignmentsQueryObject({ contactid });
    const { records: projects } = await this.dynamicsWebApi
      .queryFromObject('dcp_projects', queryObject);

    return transformIntoAssignments(projects)
      .filter(assignment => assignment.tab === tab);
  }
}

// munge projects into user assignments
function transformIntoAssignments(projects) {
  /*
    [
      ...(assignment props)
      project {
        actions,
        milestones,
        dispositions,
      }
      milestones,
      dispositions,
    ]
  */

  // this needs to happen before value-mapping because transformMilestones requires raw ids
  // of nested related references.
  const projectsWithFixedMilestones = projects.map(project => {
    project.dcp_dcp_project_dcp_projectmilestone_project =
      transformMilestones(project.dcp_dcp_project_dcp_projectmilestone_project, project);

    return project;
  });

  // this happens first bc expanded entities provide labelled properties
  // differently
  // TODO: this is screwing up milestones bc the ids need to be known
  // before they're replaced
  const valueMappedProjects = overwriteCodesWithLabels(
    projectsWithFixedMilestones,
    FIELD_LABEL_REPLACEMENT_WHITELIST,
  );

  // retrieve all assignments, inferred from lup team.
  const assignments = valueMappedProjects.map(project => {
    const { dcp_dcp_project_dcp_projectlupteam_project } = project;

    return dcp_dcp_project_dcp_projectlupteam_project.map(lupteam => {
      const tab = computeStatusTab(project, lupteam);
      const actions = transformActions(project.dcp_dcp_project_dcp_projectaction_project);
      const milestones = project.dcp_dcp_project_dcp_projectmilestone_project;
      const dispositions = project.dcp_dcp_project_dcp_communityboarddisposition_project;

      return {
        ...lupteam,
        tab,
        project: {
          ...project,
          actions,
          milestones,
        },

        // this has already been transformed above
        // TODO: however, they need to be SCOPED to the user
        milestones,

        // TODO: these need to be _scoped_ to the USER!!!
        dispositions,
      }
    });
  })
  .reduce((acc, curr) => [...acc, ...curr], []);

  return assignments;
}

function generateAssignmentsQueryObject(query) {
  const { contactid } = query;
  const DISPLAY_MILESTONE_IDS = [
    '963beec4-dad0-e711-8116-1458d04e2fb8',
    '943beec4-dad0-e711-8116-1458d04e2fb8',
    '763beec4-dad0-e711-8116-1458d04e2fb8',
    'a63beec4-dad0-e711-8116-1458d04e2fb8',
    '923beec4-dad0-e711-8116-1458d04e2fb8',
    '9e3beec4-dad0-e711-8116-1458d04e2fb8',
    'a43beec4-dad0-e711-8116-1458d04e2fb8',
    '863beec4-dad0-e711-8116-1458d04e2fb8',
    '7c3beec4-dad0-e711-8116-1458d04e2fb8',
    '7e3beec4-dad0-e711-8116-1458d04e2fb8',
    '883beec4-dad0-e711-8116-1458d04e2fb8',
    '783beec4-dad0-e711-8116-1458d04e2fb8',
    'aa3beec4-dad0-e711-8116-1458d04e2fb8',
    '823beec4-dad0-e711-8116-1458d04e2fb8',
    '663beec4-dad0-e711-8116-1458d04e2fb8',
    '6a3beec4-dad0-e711-8116-1458d04e2fb8',
    'a83beec4-dad0-e711-8116-1458d04e2fb8',
    '843beec4-dad0-e711-8116-1458d04e2fb8',
    '8e3beec4-dad0-e711-8116-1458d04e2fb8',
    '780593bb-ecc2-e811-8156-1458d04d0698',

    // these are study area entities and
    // TODO: need to also check for study
    // area flag
    '483beec4-dad0-e711-8116-1458d04e2fb8',
    '4a3beec4-dad0-e711-8116-1458d04e2fb8',
  ];
  const MILESTONES_FILTER = all(
    `(not ${comparisonOperator('statuscode', 'eq', 717170001)})`,
    containsAnyOf('_dcp_milestone_value', DISPLAY_MILESTONE_IDS, {
      comparisonStrategy: (prop, val) => comparisonOperator(prop, 'eq', val),
    }),
  );
  const DISPOSITIONS_FILTER = all(
    any(
      comparisonOperator('dcp_visibility', 'eq', 717170004),
      comparisonOperator('dcp_visibility', 'eq', 717170003),
    ),
    `(not ${comparisonOperator('statuscode', 'eq', 717170001)})`,
  );

  return {
    $count: true,
    // todo maybe alias these crm named relationships
    $filter: `
      dcp_dcp_project_dcp_communityboarddisposition_project/any(o:o/_dcp_recommendationsubmittedby_value eq ${contactid})
        and dcp_dcp_project_dcp_communityboarddisposition_project/any(o:o/statuscode eq 1)
        and dcp_dcp_project_dcp_projectlupteam_project/any(o:o/statuscode eq 1)
    `,

    // TODO: dispositions need these: AND disp.dcp_visibility IN ('General Public', 'LUP') AND disp.statuscode <> 'Deactivated'
    $expand: `
      dcp_dcp_project_dcp_communityboarddisposition_project($filter=${DISPOSITIONS_FILTER}),
      dcp_dcp_project_dcp_projectmilestone_project($filter=${MILESTONES_FILTER};$select=dcp_milestone,dcp_name,dcp_plannedstartdate,dcp_plannedcompletiondate,dcp_actualstartdate,dcp_actualenddate,statuscode,dcp_milestonesequence,dcp_remainingplanneddayscalculated,dcp_remainingplanneddays,dcp_goalduration,dcp_actualdurationasoftoday,_dcp_milestone_value,_dcp_milestoneoutcome_value),
      dcp_dcp_project_dcp_projectaction_project,
      dcp_dcp_project_dcp_projectbbl_project,
      dcp_dcp_project_dcp_projectlupteam_project($filter=_dcp_lupteammember_value eq ${contactid})
    `,
  };
}

// TODO: finish this — currently defaults to "to review"!
function computeStatusTab(project, lupteam) {
  const {
    dcp_dcp_project_dcp_projectmilestone_project: projectMilestones,
    dcp_dcp_project_dcp_communityboarddisposition_project: dispositions,
  } = project;

  // retrieve the LUP's relevant projectMilestones
  const participantProjectMilestones = projectMilestones.filter(
    milestone => (milestone.dcp_milestone === '923beec4-dad0-e711-8116-1458d04e2fb8' && lupteam.dcp_lupteammemberrole === 'CB')
      || (milestone.dcp_milestone === '943beec4-dad0-e711-8116-1458d04e2fb8' && lupteam.dcp_lupteammemberrole === 'BP')
      || (milestone.dcp_milestone === '963beec4-dad0-e711-8116-1458d04e2fb8' && lupteam.dcp_lupteammemberrole === 'BB')
    );

  const participantDispositions = dispositions.filter(
    disposition => disposition.dcp_representing === 'Borough President' && lupteam.dcp_lupteammemberrole === 'BP'
      || disposition.dcp_representing === 'Borough Board' && lupteam.dcp_lupteammemberrole === 'BB'
      || disposition.dcp_representing === 'Community Board' && lupteam.dcp_lupteammemberrole === 'CB'
    );

  if (project.statecode === 'Inactive') {
    return 'archive';
  }

  if (participantProjectMilestones.find(milestone => milestone.statuscode === 'Not Started')) {
    return 'upcoming';
  }

  // TODO: this is sensitive to sort order. we need to revise this!!!
  if (
    participantProjectMilestones.find(milestone => ['In Progress', 'Completed'].includes(milestone.statuscode))
      && participantDispositions.find(disposition => ['Inactive'].includes(disposition.statecode) && ['Submitted', 'Not Submitted'].includes(disposition.statuscode))) {
    return 'reviewed';
  }

  if (
    participantProjectMilestones.find(milestone => ['In Progress', 'Completed'].includes(milestone.statuscode))
      && participantDispositions.find(disposition => ['Active'].includes(disposition.statecode) && ['Draft', 'Saved'].includes(disposition.statuscode))) {
    return 'to-review';
  }

  return null;
}
