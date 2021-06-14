import { Injectable } from "@nestjs/common";
import { CartoService } from "../../carto/carto.service";
import { CARTO_QUERIES } from "./geometry.utilities";

/**
 * Helper type for quering Carto from borough/block information
 * pulled from the CRM (Carto queries expect this)
 */
export type BoroughBlock = {
  id: string;
  dcp_publicstatus: string;
};

@Injectable()
export class GeometryService {
  constructor(private readonly carto: CartoService) {}

  /**
   * From a list of BoroughBlocks, return map tiles and map bounds
   * for the anonymized (TODO: what does this actually mean) centroids
   * @param boroughBlocks
   */
  async createAnonymousMapWithFilters(boroughBlocks: BoroughBlock[]) {
    if (boroughBlocks.length) {
      const boroughBlockCentroidsQuery = CARTO_QUERIES.centroidsFor(
        boroughBlocks
      );
      const tiles = await this.carto.createAnonymousMap({
        version: "1.3.1",
        layers: [
          {
            type: "mapnik",
            id: "project-centroids",
            options: {
              sql: boroughBlockCentroidsQuery
            }
          }
        ]
      });

      const [{ bbox: bounds }] = await this.carto.fetchCarto(
        CARTO_QUERIES.boundingBoxOf(boroughBlockCentroidsQuery),
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

  /**
   *
   * @param x
   * @param y
   * @param radius
   */
  async getBlocksWithinDistanceFromRadius(x, y, radius): Promise<string[]> {
    const blocks = await this.carto.fetchCarto(
      CARTO_QUERIES.distinctBlocksWithinRadius(x, y, radius),
      "json",
      "post"
    );

    // Remove 1-char borough prefix from block
    // (They are concatenated in DTM)
    return blocks.map(block => `${block.block.substring(1)}`);
  }

  // Warning! Returns either null or an Object
  async getBblsFeaturecollection(boroughBlockIds: any[]) {
    // Sometimes Dynamics populates the BBLs array with one element: null.
    // So we make sure to remove all null values.
    const normalizedBbls = boroughBlockIds.filter(Boolean);

    // The carto fetch fails if we try to construct a query from an empty array,
    // so we just return null for an empty normalizedBbls array.
    if (normalizedBbls === null || normalizedBbls.length === 0) return null;

    const unionedGeoJSONQuery =
      normalizedBbls.length < 100
        ? CARTO_QUERIES.unionedGeojsonFromBbls(normalizedBbls)
        : CARTO_QUERIES.unionedGeojsonFromBoroughBlocks(normalizedBbls);

    return await this.carto.fetchCarto(unionedGeoJSONQuery, "geojson", "post");
  }

  /**
   * From a list of BoroughBlocks, get unioned GeoJSON
   * @param boroughBlocks
   */
  async getProjectGeoJSON(boroughBlocks: BoroughBlock[]) {
    if (!boroughBlocks.length) return;

    const unionedGeoJSONQuery = CARTO_QUERIES.unionedGeojsonFromBoroughBlocks(
      boroughBlocks.map(bb => bb.id)
    );
    return await this.carto.fetchCarto(unionedGeoJSONQuery, "geojson", "post");
  }
}
