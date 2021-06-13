import { Injectable } from "@nestjs/common";
import { CrmService } from "../../crm/crm.service";
import { CartoService } from "../../carto/carto.service";

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
            '{${blocks.map(bl => bl.id).join(",")}}'::text[],
            '{${blocks.map(bl => bl.dcp_publicstatus).join(",")}}'::int[]
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
      WHERE bbl IN (${bbls.join(",")})
    `;
  },

  unionedGeojsonFromBoroughBlocks(bblLike /* can be 1-5-4 or just 1-5 */) {
    const uniqueBoroughBlocks: any = [
      ...new Set(bblLike.map(bbl => bbl.substring(0, 6)))
    ];
    const boroughBlocksTuples = uniqueBoroughBlocks.map(
      block =>
        `(${block.substring(0, 1)}, ${parseInt(block.substring(1, 6), 10)})`
    );

    return `
      SELECT ST_Multi(ST_Union(the_geom)) AS the_geom
      FROM mappluto
      WHERE (borocode, block) IN (${boroughBlocksTuples.join(",")})
    `;
  }
};

export type BoroughBlock = {
  id: string;
  dcp_publicstatus: string;
};

@Injectable()
export class GeometryService {
  xmlService;

  constructor(
    private readonly crmService: CrmService,
    private readonly carto: CartoService
  ) {
    this.xmlService = crmService.xml;
  }

  async createAnonymousMapWithFilters(boroughBlocks: BoroughBlock[]) {
    if (boroughBlocks.length) {
      const sql = QUERIES.centroidsFor(boroughBlocks);
      const tiles = await this.carto.createAnonymousMap({
        version: "1.3.1",
        layers: [
          {
            type: "mapnik",
            id: "project-centroids",
            options: {
              sql
            }
          }
        ]
      });

      const [{ bbox: bounds }] = await this.carto.fetchCarto(
        QUERIES.boundingBoxOf(sql),
        "json",
        "post"
      );

      return {
        bounds,
        tiles
      };
    }

    return {};
  }

  async getBlocksFromRadiusQuery(x, y, radius): Promise<string[]> {
    const queryForBlocks = QUERIES.blocksWithinRadius(x, y, radius);
    const distinctBlocks = `SELECT DISTINCT(block) FROM (${queryForBlocks}) blocksWithinRadius`;
    const blocks = await this.carto.fetchCarto(distinctBlocks, "json", "post");

    // note: DTM stores blocks with the borough
    return blocks.map(block => `${block.block.substring(1)}`);
  }

  // Warning! Returns either null or an Object
  async getBblsGeometry(bbls = []) {
    // Sometimes Dynamics populates the BBLs array with one element: null.
    // So we make sure to remove all null values.
    const normalizedBbls = bbls.filter(Boolean);

    // The carto fetch fails if we try to construct a query from an empty array,
    // so we just return null for an empty normalizedBbls array.
    if (normalizedBbls === null || normalizedBbls.length === 0) return null;

    const SQL =
      normalizedBbls.length < 100
        ? QUERIES.unionedGeojsonFromBbls(normalizedBbls)
        : QUERIES.unionedGeojsonFromBoroughBlocks(normalizedBbls);

    return await this.carto.fetchCarto(SQL, "geojson", "post");
  }

  async getBblsFeaturecollection(bbls) {
    return await this.getBblsGeometry(bbls);
  }

  async synchronizeProjectGeometry(
    boroughBlocks: BoroughBlock[],
    projectLeadAction: string
  ) {
    if (!boroughBlocks.length) return;

    const SQL = QUERIES.unionedGeojsonFromBoroughBlocks(
      boroughBlocks.map(bb => bb.id)
    );
    const geojson = await this.carto.fetchCarto(SQL, "geojson", "post");

    await this.crmService.update("dcp_projectactions", projectLeadAction, {
      dcp_actiongeometry: JSON.stringify(geojson)
    });
  }
}
