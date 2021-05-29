import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Serializer } from "jsonapi-serializer";
import { dasherize } from "inflected";
import { ConfigService } from "../config/config.service";
import { handleDownload } from "./_utils/handle-download";
import { transformProjects } from "./_utils/transform-projects";
import { transformProjectAttributes } from "./_utils/transform-project-attributes";
import {
  KEYS as PROJECT_KEYS,
  ACTION_KEYS,
  MILESTONE_KEYS
} from "./project.entity";
import { KEYS as DISPOSITION_KEYS } from "../disposition/disposition.entity";
import { ARTIFACT_ATTRS } from "../artifact/artifacts.attrs";
import { PACKAGE_ATTRS } from "../package/packages.attrs";
import { Octokit } from "@octokit/rest";

// CrmService is a copy of the newer API we built for Applicant Portal to talk to CRM.
// It will eventually strangle out OdataService, which is an older API to accomplish
// the same thing.
import { CrmService } from "../crm/crm.service";
import {
  all,
  comparisonOperator,
  overwriteCodesWithLabels
} from "../crm/crm.utilities";
import { ArtifactService } from "../artifact/artifact.service";
import { PackageService } from "../package/package.service";
import { GeometryService } from "./geometry/geometry.service";
import {
  actionTypesFilter,
  blocksFilter,
  boroughFilter,
  certifiedReferredFilter,
  communityDistrictFilter,
  femaFloodzoneFilter,
  femaFloodzoneShadedFilter,
  postProcessQueryFilters,
  projectApplicantTextFilter,
  publicStatusFilter,
  ulurpNonUlurpFilter,
  zoningResolutionFilter
} from "./_utils/query-filters";

const ITEMS_PER_PAGE = 30;

// TODO: these lookups exist so many places, and this is probably not the rightest one
export const BOROUGH_LOOKUP = {
  Bronx: 717170000,
  Brooklyn: 717170002,
  Manhattan: 717170001,
  Queens: 717170003,
  "Staten Island": 717170004,
  Citywide: 717170005
};
export const ULURP_LOOKUP = {
  "Non-ULURP": 717170000,
  ULURP: 717170001
};
export const PROJECT_STATUS_LOOKUP = {
  Noticed: 717170005,
  Filed: 717170000,
  "In Public Review": 717170001,
  Completed: 717170002,
  Unknown: null
};
export const PROJECT_VISIBILITY_LOOKUP = {
  "Applicant Only": 717170002,
  "CPC Only": 717170001,
  "General Public": 717170003,
  "Internal DCP Only": 717170000,
  LUP: 717170004
};
export const PACKAGE_VISIBILITY_LOOKUP = {
  GENERAL_PUBLIC: 717170003
};
export const PACKAGE_STATUSCODE_LOOKUP = {
  SUBMITTED: 717170012,
  CERTIFIED: 717170005,
  REVIEWED_NO_REVISIONS_REQUIRED: 717170009,
  REVIEWED_REVISIONS_REQUIRED: 717170010,
  UNDER_REVIEW: 717170013,
  FINAL_APPROVAL: 717170008
};

const ARTIFACT_VISIBILITY_LOOKUP = {
  GENERAL_PUBLIC: 717170003
};

// Incoming query object from the client projects request
type ClientProjectQuery = {
  "community-districts"?: string[];
  "action-types"?: string[];
  "zoning-resolutions"?: string[];
  boroughs?: string[];
  dcp_ulurp_nonulurp?: string[];
  dcp_femafloodzonea?: string;
  dcp_femafloodzoneshadedx?: string;
  dcp_publicstatus?: string[];
  dcp_certifiedreferred?: [string, string];
  block?: string;
  project_applicant_text?: string;
  distance_from_point: [number, number];
  radius_from_point: number;
};

@Injectable()
export class ProjectService {
  constructor(
    private readonly config: ConfigService,
    private readonly crmService: CrmService,
    private readonly artifactService: ArtifactService,
    private readonly packageService: PackageService,
    private readonly geometryService: GeometryService
  ) {}

  async findOneByName(name: string): Promise<any> {
    const DEFAULT_PROJECT_SHOW_FIELDS = [
      "dcp_projectid",
      "dcp_name",
      "dcp_applicanttype",
      "dcp_borough",
      "dcp_ceqrnumber",
      "dcp_ceqrtype",
      "dcp_certifiedreferred",
      "dcp_femafloodzonea",
      "dcp_femafloodzoneshadedx",
      "dcp_sisubdivision",
      "dcp_sischoolseat",
      "dcp_projectbrief",
      "dcp_additionalpublicinformation",
      "dcp_projectname",
      "dcp_publicstatus",
      "dcp_projectcompleted",
      "dcp_hiddenprojectmetrictarget",
      "dcp_ulurp_nonulurp",
      "dcp_validatedcommunitydistricts",
      "dcp_bsanumber",
      "dcp_wrpnumber",
      "dcp_lpcnumber",
      "dcp_name",
      "dcp_nydospermitnumber",
      "dcp_lastmilestonedate",
      "_dcp_applicant_customer_value",
      "_dcp_applicantadministrator_customer_value"
    ];
    const MILESTONES_FILTER = all(
      `(not ${comparisonOperator("statuscode", "eq", 717170001)})`
    );

    const ACTION_STATUSCODE_DEACTIVATED = 717170003;
    const ACTIONS_FILTER = `(not ${comparisonOperator(
      "statuscode",
      "eq",
      ACTION_STATUSCODE_DEACTIVATED
    )})`;

    // WARNING: Only 5 expansions are allowed by Web API. Requesting more expansions
    // results in a silent failure.
    const EXPANSIONS = [
      `dcp_dcp_project_dcp_projectmilestone_project($filter=${MILESTONES_FILTER};$select=dcp_milestone,dcp_name,dcp_plannedstartdate,dcp_plannedcompletiondate,dcp_actualstartdate,dcp_actualenddate,statuscode,dcp_milestonesequence,dcp_remainingplanneddayscalculated,dcp_remainingplanneddays,dcp_goalduration,dcp_actualdurationasoftoday,_dcp_milestone_value,_dcp_milestoneoutcome_value,dcp_reviewmeetingdate)`,
      "dcp_dcp_project_dcp_communityboarddisposition_project($select=dcp_publichearinglocation,dcp_dateofpublichearing,dcp_boroughpresidentrecommendation,dcp_boroughboardrecommendation,dcp_communityboardrecommendation,dcp_consideration,dcp_votelocation,dcp_datereceived,dcp_dateofvote,statecode,statuscode,dcp_docketdescription,dcp_votinginfavorrecommendation,dcp_votingagainstrecommendation,dcp_votingabstainingonrecommendation,dcp_totalmembersappointedtotheboard,dcp_wasaquorumpresent,_dcp_recommendationsubmittedby_value,dcp_representing,_dcp_projectaction_value)",
      `dcp_dcp_project_dcp_projectaction_project($filter=${ACTIONS_FILTER};$select=_dcp_action_value,dcp_name,statuscode,statecode,dcp_ulurpnumber,_dcp_zoningresolution_value,dcp_ccresolutionnumber,dcp_spabsoluteurl)`,
      "dcp_dcp_project_dcp_projectbbl_project($select=dcp_bblnumber;$filter=statuscode eq 1 and dcp_validatedblock ne null)", // TODO: add filter to exclude inactives
      "dcp_dcp_project_dcp_projectkeywords_project($select=dcp_name,_dcp_keyword_value)",

      // TODO: i think there is a limit of 5 expansions so this one does not even appear
      "dcp_dcp_project_dcp_projectaddress_project($select=dcp_name)"
    ];

    const { records: projects } = await this.crmService.queryFromObject(
      "dcp_projects",
      {
        $select: DEFAULT_PROJECT_SHOW_FIELDS,
        $filter: all(
          comparisonOperator("dcp_name", "eq", name),
          comparisonOperator(
            "dcp_visibility",
            "eq",
            PROJECT_VISIBILITY_LOOKUP["General Public"]
          )
        ),
        $expand: EXPANSIONS.join(",")
      },
      1
    );
    const [firstProject] = projects;

    if (projects.length < 1)
      throw new HttpException(
        {
          code: "PROJECT_NOT_FOUND",
          title: "Project not found",
          detail: `Project ${name} not found`
        },
        HttpStatus.NOT_FOUND
      );

    const transformedProject = await transformProjectAttributes(firstProject);

    // get geoms from carto that match array of bbls
    const bblsFeaturecollection = await this.geometryService.getBblsFeaturecollection(
      firstProject.bbls
    );

    if (bblsFeaturecollection == null) {
      console.log(
        `MapPLUTO does not contain matching BBLs for project ${firstProject.id}`
      );
    } else {
      transformedProject.bbl_featurecollection = bblsFeaturecollection;
    }

    // TODO: Not clear that this gets used still
    transformedProject.video_links = [];

    let { records: projectPackages } = await this.crmService.get(
      "dcp_packages",
      `
        $filter=
          _dcp_project_value eq ${firstProject.dcp_projectid}
          and (
            dcp_visibility eq ${PACKAGE_VISIBILITY_LOOKUP.GENERAL_PUBLIC}
          )
          and (
            statuscode eq ${PACKAGE_STATUSCODE_LOOKUP.SUBMITTED}
            or statuscode eq ${PACKAGE_STATUSCODE_LOOKUP.CERTIFIED}
            or statuscode eq ${
              PACKAGE_STATUSCODE_LOOKUP.REVIEWED_NO_REVISIONS_REQUIRED
            }
            or statuscode eq ${
              PACKAGE_STATUSCODE_LOOKUP.REVIEWED_REVISIONS_REQUIRED
            }
            or statuscode eq ${PACKAGE_STATUSCODE_LOOKUP.UNDER_REVIEW}
            or statuscode eq ${PACKAGE_STATUSCODE_LOOKUP.FINAL_APPROVAL}
          )
        &$expand=dcp_package_SharePointDocumentLocations
      `
    );

    try {
      projectPackages = await Promise.all(
        projectPackages.map(async pkg => {
          try {
            return await this.packageService.packageWithDocuments(pkg);
          } catch (e) {
            console.log(e);
          }
        })
      );

      transformedProject.packages = projectPackages;
    } catch (e) {
      console.log(e);
    }

    let { records: projectArtifacts } = await this.crmService.get(
      "dcp_artifactses",
      `
      $filter=
        _dcp_project_value eq ${firstProject.dcp_projectid}
        and (
          dcp_visibility eq ${ARTIFACT_VISIBILITY_LOOKUP.GENERAL_PUBLIC}
        )
    `
    );

    try {
      projectArtifacts = await Promise.all(
        projectArtifacts.map(async artifact => {
          try {
            return await this.artifactService.artifactWithDocuments(artifact);
          } catch (e) {
            console.log(e);
          }
        })
      );

      transformedProject.artifacts = projectArtifacts;
    } catch (e) {
      console.log(e);
    }

    // TODO: disabling for now until DO resolves stability issues
    // await injectSupportDocumentURLs(transformedProject);

    return this.serialize(transformedProject);
  }

  /**
   * Compose query string for CRM service from query filter request from the client.
   * Optionally creates a "normal" query, or an XML query
   * @param query
   * @param xml
   */
  async getProjectFilters(query: ClientProjectQuery, xml: boolean = false) {
    const filters = [];
    if (query["community-districts"]) {
      filters.push(communityDistrictFilter(query["community-districts"], xml));
    }

    if (query["action-types"]) {
      filters.push(actionTypesFilter(query["action-types"], xml));
    }

    if (query["zoning-resolutions"]) {
      filters.push(zoningResolutionFilter(query["zoning-resolutions"], xml));
    }

    if (query.boroughs) {
      filters.push(boroughFilter(query.boroughs, xml));
    }

    if (query.dcp_ulurp_nonulurp) {
      filters.push(ulurpNonUlurpFilter(query.dcp_ulurp_nonulurp, xml));
    }

    if (query.dcp_femafloodzonea) {
      filters.push(femaFloodzoneFilter(query.dcp_femafloodzonea, xml));
    }

    if (query.dcp_femafloodzoneshadedx) {
      filters.push(
        femaFloodzoneShadedFilter(query.dcp_femafloodzoneshadedx, xml)
      );
    }

    if (query.dcp_publicstatus) {
      filters.push(publicStatusFilter(query.dcp_publicstatus, xml));
    }

    if (query.dcp_certifiedreferred) {
      filters.push(certifiedReferredFilter(query.dcp_certifiedreferred, xml));
    }

    if (query.block) {
      filters.push(blocksFilter([query.block], xml));
    }

    if (query.project_applicant_text) {
      filters.push(
        projectApplicantTextFilter(query.project_applicant_text, xml)
      );
    }

    if (query.distance_from_point && query.radius_from_point) {
      const blocks = await this.getBlocksWithinRadius(
        query.distance_from_point,
        query.radius_from_point
      );
      filters.push(blocksFilter(blocks, xml));
    }

    return postProcessQueryFilters(filters, xml);
  }

  /**
   * Helper function to get blocks (block numbers) within a given radius
   * around a given point, using the geometry service
   * @param point
   * @param radius
   */
  async getBlocksWithinRadius(point: [number, number], radius: number) {
    const [x, y] = point;

    return await this.geometryService.getBlocksFromRadiusQuery(x, y, radius);
  }

  /**
   * Query CRM for projects matching query filters from client,
   * process returned projects (map CRM codes, transform to shape expected by client),
   * and augment with geospatial data
   * @param query
   * @param itemsPerPage
   */
  async queryProjects(
    query: ClientProjectQuery,
    itemsPerPage = ITEMS_PER_PAGE
  ) {
    // Create query object to send to CRM
    const DEFAULT_PROJECT_LIST_FIELDS = [
      "dcp_name",
      "dcp_applicanttype",
      "dcp_borough",
      "dcp_ceqrnumber",
      "dcp_ceqrtype",
      "dcp_certifiedreferred",
      "dcp_femafloodzonea",
      "dcp_femafloodzoneshadedx",
      "dcp_sisubdivision",
      "dcp_sischoolseat",
      "dcp_projectbrief",
      "dcp_additionalpublicinformation",
      "dcp_projectname",
      "dcp_publicstatus",
      "dcp_projectcompleted",
      "dcp_hiddenprojectmetrictarget",
      "dcp_ulurp_nonulurp",
      "dcp_validatedcommunitydistricts",
      "dcp_bsanumber",
      "dcp_wrpnumber",
      "dcp_lpcnumber",
      "dcp_name",
      "dcp_nydospermitnumber",
      "dcp_lastmilestonedate",
      "_dcp_applicant_customer_value",
      "_dcp_applicantadministrator_customer_value"
    ];
    const queryObject = {
      $select: DEFAULT_PROJECT_LIST_FIELDS,
      $count: true,
      $orderby: "dcp_lastmilestonedate desc,dcp_publicstatus asc",
      $filter: await this.getProjectFilters(query),
      $expand: `dcp_dcp_project_dcp_projectbbl_project($top=1;$filter=dcp_bblvalidated eq true)`
    };

    // Make CRM query to get projects matching filters
    const {
      records: projects,
      skipTokenParams: nextPageSkipTokenParams,
      count
    } = await this.crmService.queryFromObject(
      "dcp_projects",
      queryObject,
      itemsPerPage
    );

    // Map CRM codes to human-readable values
    const valueMappedRecords = overwriteCodesWithLabels(projects);
    // Compose projects into structure the client needs
    const transformedProjects = transformProjects(valueMappedRecords);

    // Get spatial info to augment projects with
    const spatialInfo = await this.geometryService.createAnonymousMapWithFilters(
      await this.getProjectFilters(query, true)
    );

    // Serialize data into paginated API response
    return this.serialize(transformedProjects, {
      pageTotal: ITEMS_PER_PAGE,
      total: count,
      ...(nextPageSkipTokenParams
        ? { skipTokenParams: nextPageSkipTokenParams }
        : {}),

      ...spatialInfo
    });
  }

  /**
   * Make a paginated request to CRM
   * leveraging skip tokens from the client request
   * @param skipTokenParams
   */
  async paginate(skipTokenParams) {
    const {
      records: projects,
      skipTokenParams: nextPageSkipTokenParams,
      count
    } = await this.crmService.query("dcp_projects", skipTokenParams);

    const valueMappedRecords = overwriteCodesWithLabels(projects);
    const transformedProjects = transformProjects(valueMappedRecords);

    return this.serialize(transformedProjects, {
      pageTotal: ITEMS_PER_PAGE,
      total: count,
      ...(nextPageSkipTokenParams
        ? { skipTokenParams: nextPageSkipTokenParams }
        : {})
    });
  }

  async handleDownload(request, filetype) {
    const { data } = await this.queryProjects(request, 5000);

    const deserializedData = data.map(jsonApiRecord => ({
      id: jsonApiRecord.id,
      ...jsonApiRecord.attributes
    }));

    return handleDownload(filetype, deserializedData);
  }

  /**
   * Serializes an array of objects into a JSON:API document
   */
  serialize(records, opts?: object): Serializer {
    const ProjectSerializer = new Serializer("projects", {
      id: "dcp_name",
      attributes: PROJECT_KEYS,
      actions: {
        ref: "dcp_projectactionid",
        attributes: ACTION_KEYS
      },

      milestones: {
        ref: "dcp_projectmilestoneid",
        attributes: MILESTONE_KEYS
      },

      dispositions: {
        ref: "dcp_communityboarddispositionid",
        attributes: DISPOSITION_KEYS
      },

      packages: {
        ref: "dcp_packageid",
        attributes: PACKAGE_ATTRS
      },

      artifacts: {
        ref: "dcp_artifactsid",
        attributes: ARTIFACT_ATTRS
      },

      // dasherize, but also remove the dash prefix
      // because this confuses the ember client
      keyForAttribute(key) {
        let dasherized = dasherize(key);

        if (dasherized[0] === "-") {
          dasherized = dasherized.substring(1);
        }

        return dasherized;
      },

      meta: { ...opts }
    });

    return ProjectSerializer.serialize(records);
  }

  // A function for creating an issue on github based on user feedback sent from frontend `modal-controls` component
  // Users submit text on the modal stating where they think data is incorrect, which is posted to the backend.
  // Octokit creates an issue in our dcp-zap-data-feedback repository.
  // This function is run in an @Post in the project controller.
  async sendFeedbackToGithubIssue(projectid, projectname, text) {
    const octokit = new Octokit({
      auth: this.config.get("GITHUB_ACCESS_TOKEN")
    });

    return await octokit.issues.create({
      owner: "nycplanning",
      repo: "dcp-zap-data-feedback",
      title: `Feedback about ${projectname}`,
      body: `Project ID: [${projectid}](https://zap.planning.nyc.gov/projects/${projectid})\nFeedback: ${text}`
    });
  }
}
