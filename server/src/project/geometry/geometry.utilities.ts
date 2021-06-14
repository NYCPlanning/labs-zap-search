// radius_from_point value is set in the frontend as feet, we convert it to meters to run this query
const METERS_TO_FEET_FACTOR = 3.28084;

export const CARTO_QUERIES = {
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

  distinctBlocksWithinRadius(x, y, radius) {
    const adjustedRadius = radius / METERS_TO_FEET_FACTOR;

    return `
			SELECT DISTINCT(block) FROM (
      	SELECT * FROM (${this.DTM_BLOCK_CENTROIDS}) centroids
      	WHERE ST_DWithin(ST_MakePoint(${x}, ${y})::geography, centroids.the_geom::geography, ${adjustedRadius})
			) blocksWithinRadius`;
  },

  unionedGeojsonFromBbls(bbls) {
    return `
      SELECT ST_Multi(ST_Union(the_geom)) AS the_geom
      FROM mappluto
      WHERE bbl IN (${bbls.join(",")})
    `;
  },

  /**
	 * Given at least borough and block string, select 
	 * geometries with block-level resolution
	  
	 * @param bblLike	string; borough block (1-digit borough, 5-digit bloco) or 
	 * 								borough block lot (1-digit borough, 5 digit block, 4-digit lot)
	 */
  unionedGeojsonFromBoroughBlocks(bblLike: string[]) {
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
