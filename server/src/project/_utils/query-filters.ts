import * as crmUtils from "src/crm/crm.utilities";
import * as xmlUtils from "src/crm/xml/xml.utilities";
import {
  BOROUGH_LOOKUP,
  PROJECT_STATUS_LOOKUP,
  PROJECT_VISIBILITY_LOOKUP,
  ULURP_LOOKUP
} from "../project.service";

export const communityDistrictFilter = (value: string[], isXml: boolean) =>
  isXml
    ? xmlUtils.containsAnyOf(
        "dcp_validatedcommunitydistricts",
        value,
        "dcp_project"
      )
    : crmUtils.containsAnyOf("dcp_validatedcommunitydistricts", value);

export const actionTypesFilter = (value: string[], isXml: boolean) =>
  isXml
    ? xmlUtils.equalsAnyOf("dcp_name", value, "dcp_projectaction")
    : crmUtils.containsAnyOf("dcp_name", value, {
        childEntity: "dcp_dcp_project_dcp_projectaction_project"
      });

export const zoningResolutionFilter = (value: string[], isXml: boolean) =>
  isXml
    ? value
        .map(
          value =>
            `dcp_dcp_project_dcp_projectaction_project/any(o:o/_dcp_zoningresolution_value eq '${value}')`
        )
        .join(" or ")
    : value
        .map(
          v =>
            `dcp_dcp_project_dcp_projectaction_project/any(o:o/_dcp_zoningresolution_value eq '${v}')`
        )
        .join(" or ");

export const boroughFilter = (value: string[], isXml: boolean) =>
  isXml
    ? xmlUtils.containsAnyOf(
        "dcp_borough",
        crmUtils.coerceToNumber(crmUtils.mapInLookup(value, BOROUGH_LOOKUP)),
        "dcp_project"
      )
    : crmUtils.equalsAnyOf(
        "dcp_borough",
        crmUtils.coerceToNumber(crmUtils.mapInLookup(value, BOROUGH_LOOKUP))
      );

export const ulurpNonUlurpFilter = (value: string[], isXml: boolean) =>
  isXml
    ? xmlUtils.containsAnyOf(
        "dcp_ulurp_nonulurp",
        crmUtils.coerceToNumber(crmUtils.mapInLookup(value, ULURP_LOOKUP)),
        "dcp_project"
      )
    : crmUtils.equalsAnyOf(
        "dcp_ulurp_nonulurp",
        crmUtils.coerceToNumber(crmUtils.mapInLookup(value, ULURP_LOOKUP))
      );

export const femaFloodzoneFilter = (value: string, isXml: boolean) =>
  isXml
    ? xmlUtils.comparisonOperator(
        "dcp_femafloodzonea",
        "eq",
        value,
        "dcp_project"
      )
    : crmUtils.comparisonOperator("dcp_femafloodzonea", "eq", value);

export const femaFloodzoneShadedFilter = (value: string, isXml: boolean) =>
  isXml
    ? xmlUtils.comparisonOperator(
        "dcp_femafloodzoneshadedx",
        "eq",
        value,
        "dcp_project"
      )
    : crmUtils.comparisonOperator("dcp_femafloodzoneshadedx", "eq", value);

export const publicStatusFilter = (value: string[], isXml: boolean) =>
  isXml
    ? xmlUtils.containsAnyOf(
        "dcp_publicstatus",
        crmUtils.coerceToNumber(
          crmUtils.mapInLookup(value, PROJECT_STATUS_LOOKUP)
        ),
        "dcp_project"
      )
    : crmUtils.equalsAnyOf(
        "dcp_publicstatus",
        crmUtils.coerceToNumber(
          crmUtils.mapInLookup(value, PROJECT_STATUS_LOOKUP)
        )
      );

export const certifiedReferredFilter = (
  value: [string, string],
  isXml: boolean
) =>
  isXml
    ? "" // TODO: not supported yet due to a date serialization issue with XML API (?)
    : crmUtils.all(
        crmUtils.comparisonOperator(
          "dcp_certifiedreferred",
          "gt",
          crmUtils.coerceToDateString(value[0])
        ),
        crmUtils.comparisonOperator(
          "dcp_certifiedreferred",
          "lt",
          crmUtils.coerceToDateString(value[1])
        )
      );

export const blocksFilter = (value: string[], isXml: boolean) =>
  isXml
    ? xmlUtils.containsAnyOf("dcp_validatedblock", value, "dcp_projectbbl")
    : crmUtils.containsAnyOf("dcp_validatedblock", value, {
        childEntity: "dcp_dcp_project_dcp_projectbbl_project"
      });

export const projectApplicantTextFilter = (value: string, isXml: boolean) =>
  isXml
    ? xmlUtils.any(
        xmlUtils.containsString("dcp_projectbrief", value, "dcp_project"),
        xmlUtils.containsString("dcp_projectname", value, "dcp_project"),
        xmlUtils.containsString("dcp_ceqrnumber", value, "dcp_project"),
        xmlUtils.containsString("dcp_name", value, "dcp_projectapplicant"),
        xmlUtils.containsString("dcp_ulurpnumber", value, "dcp_projectaction"),
        xmlUtils.containsString("dcp_docket", value, "dcp_projectaction"),
        xmlUtils.containsString("dcp_comment", value, "dcp_projectaction"),
        xmlUtils.containsString(
          "dcp_historiczoningresolutionsectionnumber",
          value,
          "dcp_projectaction"
        )
      )
    : crmUtils.any(
        crmUtils.containsString("dcp_projectbrief", value),
        crmUtils.containsString("dcp_projectname", value),
        crmUtils.containsString("dcp_ceqrnumber", value),
        crmUtils.containsAnyOf("dcp_name", [value], {
          childEntity: "dcp_dcp_project_dcp_projectapplicant_Project"
        }),
        crmUtils.containsAnyOf("dcp_ulurpnumber", [value], {
          childEntity: "dcp_dcp_project_dcp_projectaction_project"
        }),
        crmUtils.containsAnyOf("dcp_comment", [value], {
          childEntity: "dcp_dcp_project_dcp_projectaction_project"
        }),
        crmUtils.containsAnyOf("dcp_docket", [value], {
          childEntity: "dcp_dcp_project_dcp_projectaction_project"
        }),
        crmUtils.containsAnyOf(
          "dcp_historiczoningresolutionsectionnumber",
          [value],
          {
            childEntity: "dcp_dcp_project_dcp_projectaction_project"
          }
        )
      );

// Post processing:
// - xml query: flatten into 1-D array of string filter parts
// - normal query: compose into single string filter with default visibility filter
export const postProcessQueryFilters = (queryFilters: string[], xml: boolean) =>
  xml
    ? queryFilters.join(" ")
    : crmUtils.all(
        // defaults
        crmUtils.comparisonOperator(
          "dcp_visibility",
          "eq",
          PROJECT_VISIBILITY_LOOKUP["General Public"]
        ),
        // optional params
        ...queryFilters
      );
