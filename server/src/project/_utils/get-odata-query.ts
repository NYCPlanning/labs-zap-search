import { ITEM_ROOT } from "odata-query";
import { coerceToDateString, coerceToNumber } from "src/crm/crm.utilities";
import { GeometryService } from "../geometry/geometry.service";
import {
  BOROUGH_LOOKUP,
  PROJECT_STATUS_LOOKUP,
  PROJECT_VISIBILITY_LOOKUP,
  ULURP_LOOKUP
} from "../project.service";

// Incoming query object from the client projects request
export type ClientProjectQuery = {
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

export async function getoDataFilters(
  query: ClientProjectQuery,
  geometryService: GeometryService
) {
  const filters = [];
  if (query["community-districts"]) {
    filters.push({
      ["dcp_validatedcommunitydistricts"]: { any: query["community-districts"] }
    });
  }

  if (query["action-types"]) {
    filters.push({
      ["dcp_dcp_project_dcp_projectaction_project"]: {
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
      ["dcp_dcp_project_dcp_projectaction_project"]: {
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
      or: query.boroughs.map(borough => ({
        dcp_borough: coerceToNumber(BOROUGH_LOOKUP[borough])
      }))
    });
  }

  if (query.dcp_ulurp_nonulurp) {
    filters.push({
      or: query.dcp_ulurp_nonulurp.map(ulurpStatus => ({
        dcp_ulurp_nonulurp: coerceToNumber(ULURP_LOOKUP[ulurpStatus])
      }))
    });
  }

  if (query.dcp_femafloodzonea) {
    filters.push({
      dcp_femafloodzonea: query.dcp_femafloodzonea
    });
  }

  if (query.dcp_femafloodzoneshadedx) {
    filters.push({
      dcp_femafloodzoneshadedx: query.dcp_femafloodzoneshadedx
    });
  }

  if (query.dcp_publicstatus) {
    filters.push({
      or: query.dcp_publicstatus.map(publicStatus => ({
        dcp_publicstatus: coerceToNumber(PROJECT_STATUS_LOOKUP[publicStatus])
      }))
    });
  }

  if (query.dcp_certifiedreferred) {
    filters.push({
      dcp_certifiedreferred: [
        {
          ITEM_ROOT: { gt: coerceToDateString(query.dcp_certifiedreferred[0]) }
        },
        {
          ITEM_ROOT: { lt: coerceToDateString(query.dcp_certifiedreferred[1]) }
        }
      ]
    });
  }

  if (query.block) {
    filters.push({
      dcp_dcp_project_dcp_projectbbl_project: {
        dcp_validatedblock: query.block
      }
    });
  }

  if (query.project_applicant_text) {
    filters.push({
      any: [
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
          dcp_dcp_project_dcp_projectapplicant_project: {
            contains: query.project_applicant_text
          }
        }
      ]
    });
  }

  if (query.radius_from_point && query.distance_from_point) {
    const blocksInRadius = await geometryService.getBlocksFromRadiusQuery(
      ...query.distance_from_point,
      query.radius_from_point
    );
    filters.push({
      dcp_dcp_project_dcp_projectbbl_project: {
        any: blocksInRadius.map(block => ({
          dcp_validatedblock: block
        }))
      }
    });
  }

  return {
    all: [
      { dcp_visibility: PROJECT_VISIBILITY_LOOKUP["General Public"] },
      ...filters
    ]
  };
}
