import { Injectable } from '@nestjs/common';
import { coerceToDateString, coerceToNumber, mapInLookup } from '../../odata/odata.module';
import { CrmService } from '../../crm/crm.service';
import CONSTANTS from '../../_utils/constants';
import { BOROUGH_LOOKUP, generateFromTemplate, PROJECT_STATUS_LOOKUP, ULURP_LOOKUP } from '../project.service';
import { stat } from 'fs';
import { CartoService } from '../../carto/carto.service';

const { VISIBILITY } = CONSTANTS;

// radius_from_point value is set in the frontend as feet, we convert it to meters to run this query
const METERS_TO_FEET_FACTOR = 3.28084;

const QUERIES = {
  DTM_BLOCK_CENTROIDS: `
    SELECT the_geom, the_geom_webmercator, cartodb_id, concat(borocode, LPAD(block::text, 5, '0')) as block 
    FROM dtm_block_centroids_v20201106
  `,

  centroidsFor(blocks) {
    return `
      WITH blocks_and_statuses AS (
        SELECT * FROM
          unnest(
            '{${blocks.map(bl => bl.id).join(',')}}'::text[],
            '{${blocks.map(bl => bl.dcp_publicstatus).join(',')}}'::int[]
          )
        AS x(block, status)
      )
      SELECT
        the_geom,
        the_geom_webmercator,
        cartodb_id,
        blocks_and_statuses.status AS dcp_publicstatus
      FROM (
        ${this.DTM_BLOCK_CENTROIDS}
      ) orig INNER JOIN blocks_and_statuses ON orig.block = blocks_and_statuses.block
    `;
  },

  boundingBoxOf(sql) {
    return `
        SELECT
          ARRAY[
            ARRAY[
              ST_XMin(bbox),
              ST_YMin(bbox)
            ],
            ARRAY[
              ST_XMax(bbox),
              ST_YMax(bbox)
            ]
          ] as bbox
        FROM (
          SELECT ST_Extent(ST_Transform(the_geom, 4326)) AS bbox FROM (${sql}) query
        ) extent
      `;
  },

  blocksWithinRadius(x, y, radius) {
    const adjustedRadius = radius / METERS_TO_FEET_FACTOR;

    return `
      SELECT * FROM (${this.DTM_BLOCK_CENTROIDS}) centroids
      WHERE ST_DWithin(ST_MakePoint(${x}, ${y})::geography, centroids.the_geom::geography, ${adjustedRadius})`;
  },

  unionedGeojsonFromBbls(bbls) {
    return `
      SELECT ST_Multi(ST_Union(the_geom)) AS the_geom
      FROM mappluto
      WHERE bbl IN (${bbls.join(',')})
    `;
  },

  unionedGeojsonFromBoroughBlocks(bbls) {
    const uniqueBoroughBlocks: any = [...new Set(bbls.map(bbl => bbl.substring(0, 6)))];
    const boroughBlocksTuples = uniqueBoroughBlocks.map(block => `(${block.substring(0, 1)}, ${parseInt(block.substring(1, 6), 10)})`);

    return `
      SELECT ST_Multi(ST_Union(the_geom)) AS the_geom
      FROM mappluto
      WHERE (borocode, block) IN (${boroughBlocksTuples.join(',')})
    `;
  }
}

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

  blocks: (queryParamValue) =>
    containsAnyOf('dcp_validatedblock', queryParamValue, 'dcp_projectbbl'),

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
        `<attribute name="dcp_validatedblock"/>`,
        `<attribute name="dcp_validatedborough" />`,

        `<filter type="and">`,
          `<condition attribute="statuscode" operator="eq" value="1" />`,
          `<condition attribute="dcp_validatedblock" operator="not-null" />`,
          `<condition entityname="dcp_project" attribute="dcp_visibility" operator="eq" value="${VISIBILITY.GENERAL_PUBLIC}" />`,

          ...filters,
        `</filter>`,

        `<link-entity name="dcp_project" from="dcp_projectid" to="dcp_project" link-type="inner" alias="dcpProject" distinct="true">`,
          `<attribute name="dcp_publicstatus" />`,
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
    private readonly crmService: CrmService,
    private readonly carto: CartoService,
  ) {
    this.xmlService = crmService.xml;
  }

  async createAnonymousMapWithFilters(query) {
    const blocks = await this.getBlocksFromXMLQuery(query);

    if (blocks.length) {
      const sql = QUERIES.centroidsFor(blocks);
      const tiles = await this.carto.createAnonymousMap({
        version: '1.3.1',
        layers: [{
          type: 'mapnik',
          id: 'project-centroids',
          options: {
            sql,
          },
        }],
      });

      const [{ bbox: bounds }] = await this.carto.fetchCarto(QUERIES.boundingBoxOf(sql), 'json', 'post');

      return {
        bounds,
        tiles,
      };
    }

    return {};
  }

  // return a list of blocks
  async getBlocksFromXMLQuery(query) {
    const filters = generateFromTemplate(query, QUERY_TEMPLATES)
      .reduce((acc, curr) => {
        return acc.concat(curr);
      }, []);

    try {
      const { value } = await this.xmlService.doGet(`dcp_projectbbls?fetchXml=${projectGeomsXML(filters)}`);

      return value.map(block => ({
        id: `${localizeBoroughCodes(block.dcp_validatedborough)}${block.dcp_validatedblock}`,
        dcp_publicstatus: block['dcpProject.dcp_publicstatus'],
      }));
    } catch (e) {
      console.log(e);
      console.log(projectGeomsXML(filters));
    }
  }

  async getBlocksFromRadiusQuery(x, y, radius) {
    const queryForBlocks = QUERIES.blocksWithinRadius(x, y, radius);
    const distinctBlocks = `SELECT DISTINCT(block) FROM (${queryForBlocks}) blocksWithinRadius`
    const blocks = await this.carto.fetchCarto(distinctBlocks, 'json', 'post');

    // note: DTM stores blocks with the borough
    return blocks
      .map(block => `${block.block.substring(1)}`);
  }

  async getBblsGeometry(bbls = []) {
    if (bbls === null) return null;

    const normalizedBbls = bbls.filter(Boolean);
    const SQL = (normalizedBbls.length < 100) ?
      QUERIES.unionedGeojsonFromBbls(normalizedBbls) : QUERIES.unionedGeojsonFromBoroughBlocks(normalizedBbls);

    return await this.carto.fetchCarto(SQL, 'geojson', 'post');
  }

  async getBblsFeaturecollection(bbls) {
    return await this.getBblsGeometry(bbls);
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
