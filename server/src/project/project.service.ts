import { Injectable } from '@nestjs/common';
import { Serializer } from 'jsonapi-serializer';
import { dasherize } from 'inflected';
import { ConfigService } from '../config/config.service';
import { CartoService } from '../carto/carto.service';
import { handleDownload } from './_utils/handle-download';
import { transformMilestones } from './_utils/transform-milestones';
import { transformActions } from './_utils/transform-actions';
import { transformProjects } from './_utils/transform-projects';
import { injectSupportDocumentURLs } from './_utils/inject-supporting-document-urls';
import { getVideoLinks } from './_utils/get-video-links';
import { KEYS as PROJECT_KEYS, ACTION_KEYS, MILESTONE_KEYS } from './project.entity';
import { KEYS as DISPOSITION_KEYS } from '../disposition/disposition.entity';
import { ARTIFACT_ATTRS } from '../artifact/artifacts.attrs';
import { PACKAGE_ATTRS } from '../package/packages.attrs';
import { Octokit } from '@octokit/rest';
import { OdataService, overwriteCodesWithLabels } from '../odata/odata.service';
import {
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
// CrmService is a copy of the newer API we built for Applicant Portal to talk to CRM.
// It will eventually strangle out OdataService, which is an older API to accomplish
// the same thing.
import { CrmService } from '../crm/crm.service';
import { DocumentService } from '../document/document.service';
import { GeometryService } from './geometry/geometry.service';

const ITEMS_PER_PAGE = 30;
export const BOROUGH_LOOKUP = {
  Bronx: 717170000,
  Brooklyn: 717170002,
  Manhattan: 717170001,
  Queens: 717170003,
  'Staten Island': 717170004,
  Citywide: 717170005,
};
export const ULURP_LOOKUP = {
  'Non-ULURP': 717170000,
  'ULURP': 717170001,
};
export const PROJECT_STATUS_LOOKUP = {
  Prefiled: 717170005,
  Filed: 717170000,
  'In Public Review': 717170001,
  Completed: 717170002,
  Unknown: null,
};
export const PROJECT_VISIBILITY_LOOKUP = {
  'Applicant Only': 717170002,
  'CPC Only': 717170001,
  'General Public': 717170003,
  'Internal DCP Only': 717170000,
  'LUP': 717170004,
};
export const DISPLAY_MILESTONE_IDS = [
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

// Only these fields will be value mapped
export const FIELD_LABEL_REPLACEMENT_WHITELIST = [
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
];

export const PACKAGE_VISIBILITY = {
  GENERAL_PUBLIC: 717170003,
}
export const PACKAGE_STATUSCODE = {
  SUBMITTED: 717170012,
}

const ARTIFACT_VISIBILITY = {
  GENERAL_PUBLIC: 717170003,
}

// configure received params, provide procedures for generating queries.
// these funcs do not get called unless they are in the query params.
// could these become a first class object?
const QUERY_TEMPLATES = {
  'community-districts': (queryParamValue) =>
    containsAnyOf('dcp_validatedcommunitydistricts', queryParamValue),

  'action-types': (queryParamValue) =>
    containsAnyOf('dcp_name', queryParamValue, {
      childEntity: 'dcp_dcp_project_dcp_projectaction_project'
    }),

  boroughs: (queryParamValue) =>
    equalsAnyOf('dcp_borough', coerceToNumber(mapInLookup(queryParamValue, BOROUGH_LOOKUP))),

  dcp_ulurp_nonulurp: (queryParamValue) =>
    equalsAnyOf('dcp_ulurp_nonulurp', coerceToNumber(mapInLookup(queryParamValue, ULURP_LOOKUP))),

  dcp_femafloodzonea: (queryParamValue) =>
    comparisonOperator('dcp_femafloodzonea', 'eq', queryParamValue),

  dcp_femafloodzoneshadedx: (queryParamValue) =>
    comparisonOperator('dcp_femafloodzoneshadedx', 'eq', queryParamValue),

  dcp_publicstatus: (queryParamValue: []) =>
    equalsAnyOf('dcp_publicstatus', coerceToNumber(mapInLookup(queryParamValue, PROJECT_STATUS_LOOKUP))),

  dcp_certifiedreferred: (queryParamValue) =>
    all(
      comparisonOperator('dcp_certifiedreferred', 'gt', coerceToDateString(queryParamValue[0])),
      comparisonOperator('dcp_certifiedreferred', 'lt', coerceToDateString(queryParamValue[1])),
    ),

  blocks: (queryParamValue) =>
    containsAnyOf('dcp_validatedblock', queryParamValue, {
      childEntity: 'dcp_dcp_project_dcp_projectbbl_project'
    }),

  project_applicant_text: (queryParamValue) =>
    any(
      containsString('dcp_projectbrief', queryParamValue),
      containsString('dcp_projectname', queryParamValue),
      containsString('dcp_ceqrnumber', queryParamValue),
      containsAnyOf('dcp_name', [queryParamValue], {
        childEntity: 'dcp_dcp_project_dcp_projectapplicant_Project'
      }),
      containsAnyOf('dcp_ulurpnumber', [queryParamValue], {
        childEntity: 'dcp_dcp_project_dcp_projectaction_project'
      }),
      containsAnyOf('dcp_comment', [queryParamValue], {
        childEntity: 'dcp_dcp_project_dcp_projectaction_project'
      }),
      containsAnyOf('dcp_docket', [queryParamValue], {
        childEntity: 'dcp_dcp_project_dcp_projectaction_project'
      }),
      containsAnyOf('dcp_historiczoningresolutionsectionnumber', [queryParamValue], {
        childEntity: 'dcp_dcp_project_dcp_projectaction_project'
      }),
    ),
};

export const ALLOWED_FILTERS = [
  'community-districts',
  'action-types',
  'boroughs',
  'dcp_ceqrtype', // is this even used? 'Type I', 'Type II', 'Unlisted', 'Unknown'
  'dcp_ulurp_nonulurp', // 'ULURP', 'Non-ULURP'
  'dcp_femafloodzonea',
  'dcp_femafloodzoneshadedx',
  'dcp_publicstatus', // 'Prefiled', 'Filed', 'In Public Review', 'Completed', 'Unknown'
  'dcp_certifiedreferred',
  'project_applicant_text',
  'blocks', // not sure this gets used
  'distance_from_point',
  'radius_from_point',
];

export const generateFromTemplate = (query, template) => {
  return Object.keys(query)
    .filter(key => ALLOWED_FILTERS.includes(key)) // filter is allowed
    .filter(key => template[key]) // filter has query handler
    .map(key => template[key](query[key]));
}

function generateProjectsFilterString(query) {
  // optional params
  // apply only those that appear in the query object
  const requestedFiltersQuery = generateFromTemplate(query, QUERY_TEMPLATES);

  return all(
    // defaults
    comparisonOperator('dcp_visibility', 'eq', PROJECT_VISIBILITY_LOOKUP['General Public']),

    // optional params
    ...requestedFiltersQuery,
  );
}

function generateQueryObject(query, overrides?) {
  const DEFAULT_PROJECT_LIST_FIELDS = [
    'dcp_name',
    'dcp_applicanttype',
    'dcp_borough',
    'dcp_ceqrnumber',
    'dcp_ceqrtype',
    'dcp_certifiedreferred',
    'dcp_femafloodzonea',
    'dcp_femafloodzoneshadedx',
    'dcp_sisubdivision',
    'dcp_sischoolseat',
    'dcp_projectbrief',
    'dcp_projectname',
    'dcp_publicstatus',
    'dcp_projectcompleted',
    'dcp_hiddenprojectmetrictarget',
    'dcp_ulurp_nonulurp',
    'dcp_validatedcommunitydistricts',
    'dcp_bsanumber',
    'dcp_wrpnumber',
    'dcp_lpcnumber',
    'dcp_name',
    'dcp_nydospermitnumber',
    'dcp_lastmilestonedate',
    '_dcp_applicant_customer_value',
    '_dcp_applicantadministrator_customer_value',
  ];

  // this needs to be configurable, maybe come from project entity
  const projectFields = DEFAULT_PROJECT_LIST_FIELDS.join(',');

  return {
    $select: projectFields,
    $count: true,
    $orderby: 'dcp_lastmilestonedate desc,dcp_publicstatus asc',
    $filter: generateProjectsFilterString(query),
    $expand: `dcp_dcp_project_dcp_projectbbl_project($top=1;$filter=dcp_bblvalidated eq true)`,
    ...overrides,
  };
}

export function transformProjectAttributes(project): any {
  // this must happen before value-mapping because some of the constants
  // refer to certain identifiers that are replaced after value-mapping
  project.milestones = transformMilestones(project.dcp_dcp_project_dcp_projectmilestone_project, project);
  project.dispositions = project.dcp_dcp_project_dcp_communityboarddisposition_project;

  const [valueMappedProject] = overwriteCodesWithLabels([project], FIELD_LABEL_REPLACEMENT_WHITELIST);

  project.actions = transformActions(project.dcp_dcp_project_dcp_projectaction_project);

  // perform after value-mapping
  const {
    dcp_dcp_project_dcp_projectkeywords_project,
    dcp_dcp_project_dcp_projectbbl_project,
  } = valueMappedProject;

  if (dcp_dcp_project_dcp_projectkeywords_project) {
    project.keywords = dcp_dcp_project_dcp_projectkeywords_project
      .map(({ _dcp_keyword_value }) => _dcp_keyword_value);
  }

  if (dcp_dcp_project_dcp_projectbbl_project) {
    project.bbls = dcp_dcp_project_dcp_projectbbl_project
      .map(({ dcp_bblnumber }) => dcp_bblnumber);
  }

  project.applicantteam = [{
      name: valueMappedProject._dcp_applicant_customer_value,
      role: 'Primary Applicant',
    }, {
      name: valueMappedProject._dcp_applicantadministrator_customer_value,
      role: 'Primary Contact',
    }];

  return project;
}

@Injectable()
export class ProjectService {
  constructor(
    private readonly dynamicsWebApi: OdataService,
    private readonly config: ConfigService,
    private readonly carto: CartoService,
    private readonly crmService: CrmService,
    private readonly documentService: DocumentService,
    private readonly geometryService: GeometryService,
  ) {}

  async findOneByName(name: string): Promise<any> {
    const DEFAULT_PROJECT_SHOW_FIELDS = [
      'dcp_projectid',
      'dcp_name',
      'dcp_applicanttype',
      'dcp_borough',
      'dcp_ceqrnumber',
      'dcp_ceqrtype',
      'dcp_certifiedreferred',
      'dcp_femafloodzonea',
      'dcp_femafloodzoneshadedx',
      'dcp_sisubdivision',
      'dcp_sischoolseat',
      'dcp_projectbrief',
      'dcp_projectname',
      'dcp_publicstatus',
      'dcp_projectcompleted',
      'dcp_hiddenprojectmetrictarget',
      'dcp_ulurp_nonulurp',
      'dcp_validatedcommunitydistricts',
      'dcp_bsanumber',
      'dcp_wrpnumber',
      'dcp_lpcnumber',
      'dcp_name',
      'dcp_nydospermitnumber',
      'dcp_lastmilestonedate',
      '_dcp_applicant_customer_value',
      '_dcp_applicantadministrator_customer_value',
    ];
    const MILESTONES_FILTER = all(
      `(not ${comparisonOperator('statuscode', 'eq', 717170001)})`,
      containsAnyOf('_dcp_milestone_value', DISPLAY_MILESTONE_IDS, {
        comparisonStrategy: (prop, val) => comparisonOperator(prop, 'eq', val),
      }),
    );
    const ACTIONS_FILTER = `(not ${comparisonOperator('statuscode', 'eq', 717170003)})`;

    // WARNING: Only 5 expansions are allowed by Web API. Requesting more expansions
    // results in a silent failure.
    const EXPANSIONS = [
      `dcp_dcp_project_dcp_projectmilestone_project($filter=${MILESTONES_FILTER};$select=dcp_milestone,dcp_name,dcp_plannedstartdate,dcp_plannedcompletiondate,dcp_actualstartdate,dcp_actualenddate,statuscode,dcp_milestonesequence,dcp_remainingplanneddayscalculated,dcp_remainingplanneddays,dcp_goalduration,dcp_actualdurationasoftoday,_dcp_milestone_value,_dcp_milestoneoutcome_value)`,
      'dcp_dcp_project_dcp_communityboarddisposition_project($select=dcp_publichearinglocation,dcp_dateofpublichearing,dcp_boroughpresidentrecommendation,dcp_boroughboardrecommendation,dcp_communityboardrecommendation,dcp_consideration,dcp_votelocation,dcp_datereceived,dcp_dateofvote,statecode,statuscode,dcp_docketdescription,dcp_votinginfavorrecommendation,dcp_votingagainstrecommendation,dcp_votingabstainingonrecommendation,dcp_totalmembersappointedtotheboard,dcp_wasaquorumpresent,_dcp_recommendationsubmittedby_value,dcp_representing,_dcp_projectaction_value)',
      `dcp_dcp_project_dcp_projectaction_project($filter=${ACTIONS_FILTER};$select=_dcp_action_value,dcp_name,statuscode,statecode,dcp_ulurpnumber,_dcp_zoningresolution_value,dcp_ccresolutionnumber)`,
      'dcp_dcp_project_dcp_projectbbl_project($select=dcp_bblnumber;$filter=statuscode eq 1)', // TODO: add filter to exclude inactives
      'dcp_dcp_project_dcp_projectkeywords_project($select=dcp_name,_dcp_keyword_value)',

      // TODO: i think there is a limit of 5 expansions so this one does not even appear
      'dcp_dcp_project_dcp_projectaddress_project($select=dcp_name)',
    ];
    const { records: projects } = await this.dynamicsWebApi
      .queryFromObject('dcp_projects', {
        $select: DEFAULT_PROJECT_SHOW_FIELDS,
        $filter: all(
          comparisonOperator('dcp_name', 'eq', name),
          comparisonOperator('dcp_visibility', 'eq', 717170003),
        ),
        $expand: EXPANSIONS.join(','),
      }, 1);
    const [firstProject] = projects;

    const transformedProject = await transformProjectAttributes(firstProject);

    // get geoms from carto that match array of bbls
    const bblsFeaturecollection = await this.geometryService.getBblsFeaturecollection(firstProject.bbls);

    if (bblsFeaturecollection == null) {
      console.log(`MapPLUTO does not contain matching BBLs for project ${firstProject.id}`);
    } else {
      transformedProject.bbl_featurecollection = bblsFeaturecollection;
    }

    transformedProject.video_links = await getVideoLinks(this.config.get('AIRTABLE_API_KEY'), firstProject.dcp_name);

    let { records: projectPackages } = await this.crmService.get('dcp_packages', `
        $filter=
          _dcp_project_value eq ${firstProject.dcp_projectid}
          and (
            dcp_visibility eq ${PACKAGE_VISIBILITY.GENERAL_PUBLIC}
          )
          and (
            statuscode eq ${PACKAGE_STATUSCODE.SUBMITTED}
          )
      `);

    projectPackages = await Promise.all(projectPackages.map(async (pkg) => {
        return await this.documentService.packageWithDocuments(pkg);
      }));

    transformedProject.packages = projectPackages;

    let { records: projectArtifacts } = await this.crmService.get('dcp_artifactses', `
      $filter=
        _dcp_project_value eq ${firstProject.dcp_projectid}
        and (
          dcp_visibility eq ${ARTIFACT_VISIBILITY.GENERAL_PUBLIC}
        )
    `);

    projectArtifacts = await Promise.all(projectArtifacts.map(async (artifact) => {
        return await this.documentService.artifactWithDocuments(artifact);
      }));
    
    transformedProject.artifacts = projectArtifacts;

    await injectSupportDocumentURLs(transformedProject);

    return this.serialize(transformedProject);
  }

  async blocksWithinRadius(query) {
    let {
      distance_from_point,
      radius_from_point
    } = query;

    if (!distance_from_point || !radius_from_point) return [];

    // search cannot support more than 1000 because of URI Too Large errors
    // if (radius_from_point > 1000) radius_from_point = 1000;

    const [x, y]  = distance_from_point;

    return await this.geometryService.getBlocksFromRadiusQuery(x, y, radius_from_point);
  }

  async queryProjects(query, itemsPerPage = ITEMS_PER_PAGE) {
    const blocks = await this.blocksWithinRadius(query);

    // adds in the blocks filter for use across various query types
    const normalizedQuery = {
      ...query,

      // this information is sent as separate filters but must be represented as one
      // to work correctly with the query template system.
      ...(blocks.length ? { blocks } : {}),
    };
    const queryObject = generateQueryObject(normalizedQuery);
    const spatialInfo = await this.geometryService.createAnonymousMapWithFilters(normalizedQuery);
    const {
      records: projects,
      skipTokenParams: nextPageSkipTokenParams,
      count,
    } = await this.dynamicsWebApi
      .queryFromObject('dcp_projects', queryObject, itemsPerPage);

    const valueMappedRecords = overwriteCodesWithLabels(projects, FIELD_LABEL_REPLACEMENT_WHITELIST);
    const transformedProjects = transformProjects(valueMappedRecords);

    return this.serialize(transformedProjects, {
      pageTotal: ITEMS_PER_PAGE,
      total: count,
      ...(nextPageSkipTokenParams ? { skipTokenParams: nextPageSkipTokenParams } : {}),

      ...spatialInfo,
    });
  }

  async paginate(skipTokenParams) {
    const {
      records: projects,
      skipTokenParams: nextPageSkipTokenParams,
      count,
    } = await this.dynamicsWebApi
      .query('dcp_projects', skipTokenParams, ITEMS_PER_PAGE);

    const valueMappedRecords = overwriteCodesWithLabels(projects, FIELD_LABEL_REPLACEMENT_WHITELIST);
    const transformedProjects = transformProjects(valueMappedRecords);

    return this.serialize(transformedProjects, {
      pageTotal: ITEMS_PER_PAGE,
      total: count,
      ...(nextPageSkipTokenParams ? { skipTokenParams: nextPageSkipTokenParams } : {}),
    });
  }

  async handleDownload(request, filetype) {
    const { data } = await this.queryProjects(request, 5000);

    const deserializedData = data
      .map(jsonApiRecord => ({ id: jsonApiRecord.id, ...jsonApiRecord.attributes }));

    return handleDownload(filetype, deserializedData);
  }

  // Serializes an array of objects into a JSON:API document
  serialize(records, opts?: object): Serializer {
    const ProjectSerializer = new Serializer('projects', {
      id: 'dcp_name',
      attributes: PROJECT_KEYS,
      actions: {
        ref: 'dcp_projectactionid',
        attributes: ACTION_KEYS,
      },

      milestones: {
        ref: 'dcp_projectmilestoneid',
        attributes: MILESTONE_KEYS,
      },

      dispositions: {
        ref: 'dcp_communityboarddispositionid',
        attributes: DISPOSITION_KEYS,
      },

      packages: {
        ref: 'dcp_packageid',
        attributes: PACKAGE_ATTRS,
      },

      artifacts: {
        ref: 'dcp_artifactsid',
        attributes: ARTIFACT_ATTRS,
      },

      // dasherize, but also remove the dash prefix
      // because this confuses the ember client
      keyForAttribute(key) {
        let dasherized = dasherize(key);

        if (dasherized[0] === '-') {
          dasherized = dasherized.substring(1);
        }

        return dasherized;
      },

      meta: { ...opts },
    });

    return ProjectSerializer.serialize(records);
  }

  // A function for creating an issue on github based on user feedback sent from frontend `modal-controls` component
  // Users submit text on the modal stating where they think data is incorrect, which is posted to the backend.
  // Octokit creates an issue in our dcp-zap-data-feedback repository.
  // This function is run in an @Post in the project controller.
  async sendFeedbackToGithubIssue(projectid, projectname, text) {
    const octokit = new Octokit({
      auth: this.config.get('GITHUB_ACCESS_TOKEN'),
    });

    return await octokit.issues.create({
      owner: 'nycplanning',
      repo: 'dcp-zap-data-feedback',
      title: `Feedback about ${projectname}`,
      body: `Project ID: [${projectid}](https://zap.planning.nyc.gov/projects/${projectid})\nFeedback: ${text}`,
    });
  }
}
