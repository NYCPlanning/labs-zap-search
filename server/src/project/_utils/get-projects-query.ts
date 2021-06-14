import { Filter, ITEM_ROOT } from "odata-query";
import {
  coerceToDateString,
  coerceToNumberArray,
  mapInLookup
} from "src/crm/crm.utilities";
import { GeometryService } from "../geometry/geometry.service";
import {
  BOROUGH_LOOKUP,
  PROJECT_STATUS_LOOKUP,
  PROJECT_VISIBILITY_LOOKUP,
  ULURP_LOOKUP
} from "../project.service";
import buildQuery from "odata-query";
import { ClientProjectQuery } from "../project.controller";

// Project entity class for type-safe query building
export class Project {
  dcp_name: string = "";
  dcp_applicanttype: string = "";
  dcp_borough: string = "";
  dcp_ceqrnumber: string = "";
  dcp_ceqrtype: string = "";
  dcp_certifiedreferred: string = "";
  dcp_femafloodzonea: boolean = false;
  dcp_femafloodzoneshadedx: boolean = false;
  dcp_sisubdivision: boolean = false;
  dcp_sischoolseat: boolean = false;
  dcp_projectbrief: string = "";
  dcp_projectname: string = "";
  dcp_publicstatus: string = "";
  dcp_projectcompleted: string = "";
  dcp_hiddenprojectmetrictarget: string = "";
  dcp_ulurp_nonulurp: string = "";
  dcp_validatedcommunitydistricts: string = "";
  dcp_bsanumber: string = "";
  dcp_wrpnumber: string = "";
  dcp_lpcnumber: string = "";
  dcp_nydospermitnumber: string = "";
  dcp_lastmilestonedate: string = "";
  _dcp_applicant_customer_value: string = "";
  _dcp_applicantadministrator_customer_value: string = "";
  // Not needed for project query select, so no default values
  _dcp_leadaction_value: string;
  dcp_dcp_project_dcp_projectbbl_project: any;
}

export async function getProjectsBlocksQuery(
  query: ClientProjectQuery,
  geometryService: GeometryService
) {
  return buildQuery<Project>({
    select: ["dcp_name", "dcp_publicstatus"],
    filter: await getoDataFilters(query, geometryService),
    expand: [
      {
        dcp_dcp_project_dcp_projectbbl_project: {
          select: ["dcp_validatedblock", "dcp_validatedborough"],
          filter: [{ statuscode: 1 }, { not: { dcp_validatedblock: null } }]
        }
      }
    ]
  });
}

export async function getProjectsQuery(
  query: ClientProjectQuery,
  geometryService: GeometryService
) {
  return buildQuery<Project>({
    select: Object.getOwnPropertyNames(new Project()) as (keyof Project)[],
    count: true,
    filter: await getoDataFilters(query, geometryService),
    expand: [
      {
        dcp_dcp_project_dcp_projectbbl_project: {
          top: 1,
          filter: { dcp_bblvalidated: true }
        }
      }
    ],
    orderBy: [["dcp_lastmilestonedate", "desc"], ["dcp_publicstatus", "asc"]]
  });
}

export async function getoDataFilters(
  query: ClientProjectQuery,
  geometryService: GeometryService
): Promise<Filter> {
  const filters = [];
  if (query["community-districts"]) {
    filters.push({
      dcp_validatedcommunitydistricts: {
        or: query["community-districts"].map(communityDistrict => ({
          [ITEM_ROOT]: { contains: communityDistrict }
        }))
      }
    });
  }

  if (query["action-types"]) {
    filters.push({
      dcp_dcp_project_dcp_projectaction_project: {
        any: {
          or: query["action-types"].map(actionType => ({
            dcp_name: { contains: actionType }
          }))
        }
      }
    });
  }

  if (query["zoning-resolutions"]) {
    filters.push({
      dcp_dcp_project_dcp_projectaction_project: {
        any: {
          or: query["zoning-resolutions"].map(zoningResolution => ({
            _dcp_zoningresolution_value: zoningResolution
          }))
        }
      }
    });
  }

  if (query.boroughs) {
    filters.push({
      or: coerceToNumberArray(mapInLookup(query.boroughs, BOROUGH_LOOKUP)).map(
        borough => ({
          dcp_borough: borough
        })
      )
    });
  }

  if (query.dcp_ulurp_nonulurp) {
    filters.push({
      or: coerceToNumberArray(
        mapInLookup(query.dcp_ulurp_nonulurp, ULURP_LOOKUP)
      ).map(ulurpStatus => ({
        dcp_ulurp_nonulurp: ulurpStatus
      }))
    });
  }

  if (query.dcp_femafloodzonea) {
    filters.push({
      dcp_femafloodzonea: query.dcp_femafloodzonea === "true"
    });
  }

  if (query.dcp_femafloodzoneshadedx) {
    filters.push({
      dcp_femafloodzoneshadedx: query.dcp_femafloodzoneshadedx === "true"
    });
  }

  if (query.dcp_publicstatus) {
    filters.push({
      or: coerceToNumberArray(
        mapInLookup(query.dcp_publicstatus, PROJECT_STATUS_LOOKUP)
      ).map(publicStatus => ({
        dcp_publicstatus: publicStatus
      }))
    });
  }

  if (query.dcp_certifiedreferred) {
    filters.push({
      dcp_certifiedreferred: {
        and: [
          {
            [ITEM_ROOT]: {
              gt: coerceToDateString(query.dcp_certifiedreferred[0])
            }
          },
          {
            [ITEM_ROOT]: {
              lt: coerceToDateString(query.dcp_certifiedreferred[1])
            }
          }
        ]
      }
    });
  }

  if (query.block) {
    filters.push({
      dcp_dcp_project_dcp_projectbbl_project: {
        any: { dcp_validatedblock: { contains: query.block } }
      }
    });
  }

  if (query.project_applicant_text) {
    filters.push({
      or: [
        { dcp_projectbrief: { contains: query.project_applicant_text } },
        { dcp_projectname: { contains: query.project_applicant_text } },
        { dcp_ceqrnumber: { contains: query.project_applicant_text } },
        {
          dcp_dcp_project_dcp_projectaction_project: {
            any: [
              { dcp_ulurpnumber: { contains: query.project_applicant_text } },
              { dcp_comment: { contains: query.project_applicant_text } },
              { dcp_docket: { contains: query.project_applicant_text } },
              {
                dcp_historiczoningresolutionsectionnumber: {
                  contains: query.project_applicant_text
                }
              }
            ]
          }
        },
        {
          dcp_dcp_project_dcp_projectapplicant_Project: {
            any: { dcp_name: { contains: query.project_applicant_text } }
          }
        }
      ]
    });
  }

  if (query.radius_from_point && query.distance_from_point) {
    const blocksInRadius = await geometryService.getBlocksWithinDistanceFromRadius(
      query.distance_from_point[0],
      query.distance_from_point[1],
      query.radius_from_point
    );

    filters.push({
      dcp_dcp_project_dcp_projectbbl_project: {
        any: {
          or: blocksInRadius.map(block => ({
            dcp_validatedblock: { contains: block }
          }))
        }
      }
    });
  }

  return {
    and: [
      { dcp_visibility: PROJECT_VISIBILITY_LOOKUP["General Public"] },
      ...filters
    ]
  };
}
