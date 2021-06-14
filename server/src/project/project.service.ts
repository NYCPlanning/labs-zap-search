import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Serializer } from "jsonapi-serializer";
import { dasherize } from "inflected";
import { ConfigService } from "../config/config.service";
import { handleDownload } from "./_utils/handle-download";
import { transformMilestones } from "./_utils/transform-milestones";
import { transformActions } from "./_utils/transform-actions";
import { transformProjects } from "./_utils/transform-projects";
import {
  KEYS as PROJECT_KEYS,
  ACTION_KEYS,
  MILESTONE_KEYS
} from "./project.entity";
import { KEYS as DISPOSITION_KEYS } from "../disposition/disposition.entity";
import { ARTIFACT_ATTRS } from "../artifact/artifacts.attrs";
import { PACKAGE_ATTRS } from "../package/packages.attrs";
import { Octokit } from "@octokit/rest";
import buildQuery, { ITEM_ROOT } from "odata-query";

import { CrmService } from "../crm/crm.service";
import { overwriteCodesWithLabels } from "../crm/crm.utilities";
import { ArtifactService } from "../artifact/artifact.service";
import { PackageService } from "../package/package.service";
import { GeometryService } from "./geometry/geometry.service";
import {
  getProjectsBlocksQuery,
  getProjectsQuery,
  Project
} from "./_utils/get-projects-query";
import { transformProjectsBlocks } from "./_utils/transform-projects-blocks";
import { getProjectDetailQuery } from "./_utils/get-project-detail-query";
import { ClientProjectQuery } from "./project.controller";

const ITEMS_PER_PAGE = 30;
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
export const ACTION_STATUSCODE_LOOKUP = {
  Deactivated: 717170003
};
export const PROJECT_VISIBILITY_LOOKUP = {
  "Applicant Only": 717170002,
  "CPC Only": 717170001,
  "General Public": 717170003,
  "Internal DCP Only": 717170000,
  LUP: 717170004
};

// Only these fields will be value mapped
export const FIELD_LABEL_REPLACEMENT_WHITELIST = [
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
  "_dcp_zoningresolution_value"
];

export const PACKAGE_VISIBILITY = {
  GENERAL_PUBLIC: 717170003
};
export const PACKAGE_STATUSCODE = {
  SUBMITTED: 717170012,
  CERTIFIED: 717170005,
  REVIEWED_NO_REVISIONS_REQUIRED: 717170009,
  REVIEWED_REVISIONS_REQUIRED: 717170010,
  UNDER_REVIEW: 717170013,
  FINAL_APPROVAL: 717170008
};

const ARTIFACT_VISIBILITY = {
  GENERAL_PUBLIC: 717170003
};

export function transformProjectAttributes(project): any {
  // this must happen before value-mapping because some of the constants
  // refer to certain identifiers that are replaced after value-mapping
  project.milestones = transformMilestones(
    project.dcp_dcp_project_dcp_projectmilestone_project,
    project
  );
  project.dispositions =
    project.dcp_dcp_project_dcp_communityboarddisposition_project;

  const [valueMappedProject] = overwriteCodesWithLabels(
    [project],
    FIELD_LABEL_REPLACEMENT_WHITELIST
  );

  project.actions = transformActions(
    project.dcp_dcp_project_dcp_projectaction_project
  );

  // perform after value-mapping
  const {
    dcp_dcp_project_dcp_projectkeywords_project,
    dcp_dcp_project_dcp_projectbbl_project
  } = valueMappedProject;

  if (dcp_dcp_project_dcp_projectkeywords_project) {
    project.keywords = dcp_dcp_project_dcp_projectkeywords_project.map(
      ({ _dcp_keyword_value }) => _dcp_keyword_value
    );
  }

  if (dcp_dcp_project_dcp_projectbbl_project) {
    project.bbls = dcp_dcp_project_dcp_projectbbl_project.map(
      ({ dcp_bblnumber }) => dcp_bblnumber
    );
  }

  project.applicantteam = [
    {
      name: valueMappedProject._dcp_applicant_customer_value,
      role: "Primary Applicant"
    },
    {
      name: valueMappedProject._dcp_applicantadministrator_customer_value,
      role: "Primary Contact"
    }
  ];

  return project;
}

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
    const { records: projects } = await this.crmService.query(
      "dcp_projects",
      getProjectDetailQuery(name)
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
      buildQuery({
        filter: {
          and: [
            { _dcp_project_value: firstProject.dcp_projectid },
            { dcp_visibility: PACKAGE_VISIBILITY.GENERAL_PUBLIC },
            {
              statuscode: {
                or: Object.values(PACKAGE_STATUSCODE).map(statusCode => ({
                  [ITEM_ROOT]: statusCode
                }))
              }
            }
          ]
        },
        expand: "dcp_package_SharePointDocumentLocations"
      })
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
      buildQuery({
        filter: [
          { _dcp_project_value: firstProject.dcp_projectid },
          { and: { dcp_visibility: ARTIFACT_VISIBILITY.GENERAL_PUBLIC } }
        ]
      })
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

  async queryProjects(query: ClientProjectQuery) {
    // Query for all projects that match filters from client
    // TODO: re-implement missing pagination ?
    const {
      records: projects,
      skipTokenParams: _,
      count
    } = await this.crmService.query(
      "dcp_projects",
      await getProjectsQuery(query, this.geometryService)
    );

    // Keep blocks query separate so pagination can be supported
    // (altho: currently, response time is _fine_ returning all projects up to 5000; do we need server-side pagination?)
    const { records: projectsBlocks } = await this.crmService.query(
      "dcp_projects",
      await getProjectsBlocksQuery(query, this.geometryService)
    );

    // Query geometry service to get spatial info for projects
    const spatialInfo = await this.geometryService.createAnonymousMapWithFilters(
      transformProjectsBlocks(projectsBlocks)
    );

    // Transform projects
    // TODO: combine transformations into single function
    const valueMappedProjects = overwriteCodesWithLabels(
      projects,
      FIELD_LABEL_REPLACEMENT_WHITELIST
    );
    const transformedProjects = transformProjects(valueMappedProjects);

    return this.serialize(transformedProjects, {
      total: count,
      ...spatialInfo
    });
  }

  /**
   * @param id
   */
  async syncProject(id: string) {
    const { records: projectBlocks } = await this.crmService.query(
      "dcp_projects",
      buildQuery<Project>({
        select: ["dcp_publicstatus", "_dcp_leadaction_value"],
        filter: {
          dcp_projectid: id
        },
        expand: [
          {
            dcp_dcp_project_dcp_projectbbl_project: {
              select: ["dcp_validatedblock", "dcp_validatedborough"],
              filter: [{ statuscode: 1 }, { not: { dcp_validatedblock: null } }]
            }
          }
        ]
      })
    );
    const projectLeadAction = projectBlocks[0]._dcp_leadaction_value;
    const updatedGeoJSON = this.geometryService.getProjectGeoJSON(
      transformProjectsBlocks(projectBlocks)
    );

    await this.crmService.update("dcp_projectactions", projectLeadAction, {
      dcp_actiongeometry: JSON.stringify(updatedGeoJSON)
    });
  }

  //TODO: re-implement pagination?
  async paginate(skipTokenParams) {
    const {
      records: projects,
      skipTokenParams: nextPageSkipTokenParams,
      count
    } = await this.crmService.query("dcp_projects", skipTokenParams);

    const valueMappedRecords = overwriteCodesWithLabels(
      projects,
      FIELD_LABEL_REPLACEMENT_WHITELIST
    );
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
    const { data } = await this.queryProjects(request);

    const deserializedData = data.map(jsonApiRecord => ({
      id: jsonApiRecord.id,
      ...jsonApiRecord.attributes
    }));

    return handleDownload(filetype, deserializedData);
  }

  // Serializes an array of objects into a JSON:API document
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
