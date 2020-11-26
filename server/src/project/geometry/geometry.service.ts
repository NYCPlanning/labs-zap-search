import { Injectable } from '@nestjs/common';
import { coerceToDateString, coerceToNumber, mapInLookup } from '../../odata/odata.module';
import { CrmService } from '../../crm/crm.service';
import CONSTANTS from '../../_utils/constants';
import { BOROUGH_LOOKUP, generateFromTemplate, PROJECT_STATUS_LOOKUP, ULURP_LOOKUP } from '../project.service';
import { stat } from 'fs';

const { VISIBILITY } = CONSTANTS;

const containsAnyOf = (key, strings = [], entityName='') => {
  if (!strings.length) return '';

  const values = strings
    .filter(Boolean) // no null values allowed
    .map(s => `<value>${s}</value>`)
    .join('');

  const hasNullValue = !strings.every(Boolean);
  const list = `<condition ${entityName ? `entityname="${entityName}"` : ''} attribute="${key}" operator="in">${values}</condition>`;

  if (hasNullValue) {
    return `
      <filter type="or">
        <condition entityname="${entityName}" attribute="${key}" operator="null" />
        ${list}
      </filter>
    `;
  }

  return list;
};
const equalsAnyOf = (key, strings = [], entityName = '') => {
  return strings.map(s => containsString(key, s, entityName))
};
const comparisonOperator = (key, operator, value, entityName = '') => {
  return `<condition ${entityName ? `entityname="${entityName}"` : '' } attribute="${key}" operator="${operator}" value="${value}" />`;
};
const all = (...statements) => {
  return [
    '<filter type="and">',
      ...statements,
    '</filter>',
  ];
};
const any = (...statements) => {
  return [
    '<filter type="or">',
      ...statements,
    '</filter>',
  ];
};
const containsString = (key, value, entityName='') => {
  return `<condition ${entityName ? `entityname="${entityName}"` : '' } attribute="${key}" operator="like" value="% ${value} %" />`
};

// configure received params, provide procedures for generating queries.
// these funcs do not get called unless they are in the query params.
// could these become a first class object?
const QUERY_TEMPLATES = {
  'community-districts': (queryParamValue) =>
    containsAnyOf('dcp_validatedcommunitydistricts', queryParamValue, 'dcp_project'),

  'action-types': (queryParamValue) =>
    equalsAnyOf('dcp_name', queryParamValue, 'dcp_projectaction'),

  boroughs: (queryParamValue) =>
    containsAnyOf('dcp_borough', coerceToNumber(mapInLookup(queryParamValue, BOROUGH_LOOKUP)), 'dcp_project'),

  dcp_ulurp_nonulurp: (queryParamValue) =>
    containsAnyOf('dcp_ulurp_nonulurp', coerceToNumber(mapInLookup(queryParamValue, ULURP_LOOKUP)), 'dcp_project'),

  dcp_femafloodzonev: (queryParamValue) =>
    comparisonOperator('dcp_femafloodzonev', 'eq', queryParamValue, 'dcp_project'),

  dcp_femafloodzonecoastala: (queryParamValue) =>
    comparisonOperator('dcp_femafloodzonecoastala', 'eq', queryParamValue, 'dcp_project'),

  dcp_femafloodzonea: (queryParamValue) =>
    comparisonOperator('dcp_femafloodzonea', 'eq', queryParamValue, 'dcp_project'),

  dcp_femafloodzoneshadedx: (queryParamValue) =>
    comparisonOperator('dcp_femafloodzoneshadedx', 'eq', queryParamValue, 'dcp_project'),

  dcp_publicstatus: (queryParamValue: []) =>
    containsAnyOf('dcp_publicstatus', coerceToNumber(mapInLookup(queryParamValue, PROJECT_STATUS_LOOKUP)), 'dcp_project'),

  // NOT SUPPORTED YET — fix the date serialization issue
  // dcp_certifiedreferred: (queryParamValue) =>
  //   all(
  //     comparisonOperator('dcp_certifiedreferred', 'gt', coerceToDateString(queryParamValue[0]), 'dcp_project'),
  //     comparisonOperator('dcp_certifiedreferred', 'lt', coerceToDateString(queryParamValue[1]), 'dcp_project'),
  //   ),

  project_applicant_text: (queryParamValue) =>
    any(
      containsString('dcp_projectbrief', queryParamValue, 'dcp_project'),
      containsString('dcp_projectname', queryParamValue, 'dcp_project'),
      containsString('dcp_ceqrnumber', queryParamValue, 'dcp_project'),
      containsString('dcp_name', queryParamValue, 'dcp_projectapplicant'),
      containsString('dcp_ulurpnumber', queryParamValue, 'dcp_projectaction'),
    ),
};

const projectGeomsXML = (filters = []) => {
  return [
   `<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="true">`,
      `<entity name="dcp_projectbbl">`,
        `<attribute name="dcp_validatedblock" distinct="true" />`,
        `<attribute name="dcp_validatedborough" />`,
        `<filter type="and">`,
          `<condition attribute="statuscode" operator="eq" value="1" />`,
          `<condition attribute="dcp_validatedblock" operator="not-null" />`,
          `<condition entityname="dcp_project" attribute="dcp_visibility" operator="eq" value="${VISIBILITY.GENERAL_PUBLIC}" />`,

          ...filters,
        `</filter>`,

        `<link-entity name="dcp_project" from="dcp_projectid" to="dcp_project" link-type="inner" distinct="true">`,
          `<link-entity name="dcp_projectaction" from="dcp_project" to="dcp_projectid" link-type="inner" alias="ad" />`,
          `<link-entity name="dcp_projectapplicant" from="dcp_project" to="dcp_projectid" link-type="inner" alias="ab" />`,
        `</link-entity>`,
      `</entity>`,
    `</fetch>`,
  ];
};

@Injectable()
export class GeometryService {
  xmlService;

  constructor(
    private readonly crmService: CrmService
  ) {
    this.xmlService = crmService.xml;
  }

  // return a list of blocks
  async getBlocksFromQuery(query) {
    const filters = generateFromTemplate(query, QUERY_TEMPLATES)
      .reduce((acc, curr) => {
        return acc.concat(curr);
      }, []);

    try {
      const { value } = await this.xmlService.doGet(`dcp_projectbbls?fetchXml=${projectGeomsXML(filters)}`);

      return value.map(block => `${localizeBoroughCodes(block.dcp_validatedborough)}${block.dcp_validatedblock}`);
    } catch (e) {
      console.log(e);
      console.log(projectGeomsXML(filters));
    }
  }
}

// these are represented as MS Dynamics CRM-specific codings in CRM, but
// when we join them to block data, they are represented differently
function localizeBoroughCodes(crmCodedBorough) {
  switch (crmCodedBorough) {
    case 717170002:
      return 3; 
    case 717170000:
      return 2;
    case 717170001:
      return 1;
    case 717170003:
      return 4;
    case 717170004:
      return 5;
  }
}
