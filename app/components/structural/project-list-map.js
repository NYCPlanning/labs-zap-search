import Component from '@ember/component';
import { action, computed } from '@ember/object';

const expandToPolygonZoomThreshold = 14;
const PROJECT_STATUS_COLOR_RAMP_CONFIG = {
  property: 'dcp_publicstatus_simp',
  type: 'categorical',
  stops: [
    ['Filed', '#78D271'],
    ['In Public Review', '#0979C3'],
    ['Completed', '#a6cee3'],
  ],
  default: '#6b717b',
};

export const projectCentroidsCircleLayer = {
  id: 'project-centroids-circle',
  type: 'circle',
  source: 'project-centroids',
  'source-layer': 'project-centroids',
  minzoom: 0,
  maxzoom: expandToPolygonZoomThreshold,
  paint: {
    'circle-radius': {
      stops: [[10, 3], [15, 4]],
    },
    'circle-color': PROJECT_STATUS_COLOR_RAMP_CONFIG,
    'circle-opacity': 1,
    'circle-stroke-width': { stops: [[10, 1], [15, 2]] },
    'circle-stroke-color': '#FFFFFF',
  },
};

export const projectCentroidsCircleHoverLayer = {
  id: 'project-centroids-circle-hover',
  type: 'circle',
  source: 'project-centroids',
  'source-layer': 'project-centroids',
  minzoom: 0,
  maxzoom: expandToPolygonZoomThreshold,
  layout: { visibility: 'none' },
  paint: {
    'circle-radius': 5,
    'circle-color': '#ae561f',
    'circle-opacity': 1,
    'circle-stroke-width': { stops: [[10, 1], [15, 2]] },
    'circle-stroke-color': '#FFFFFF',
  },
};

export const projectPolygonsLayer = {
  id: 'project-polygons-fill',
  type: 'fill',
  source: 'project-centroids',
  'source-layer': 'project-centroids',
  minzoom: expandToPolygonZoomThreshold,
  maxzoom: 24,
  paint: {
    'fill-color': PROJECT_STATUS_COLOR_RAMP_CONFIG,
    'fill-opacity': 0.3,
  },
};

export const projectPolygonsHoverLayer = {
  id: 'project-polygons-fill-hover',
  type: 'fill',
  source: 'project-centroids',
  'source-layer': 'project-centroids',
  minzoom: 0,
  maxzoom: expandToPolygonZoomThreshold,
  paint: {
    'fill-color': 'rgba(237, 189, 18, 0.3)',
  },
};

/**
  * This component renders a map and receives a tiles URL
  * for rendering dynamic tiles. It's responsible for some styling
  * and is largely responsible for ZAP-specific styling issues.
  *
  * It also yields out some contextual components that can be used
  * where this component is invoked. It also threads down an action to
  * determine tile mode.
  *
  * Tile mode is what determines whether we see polygon or centroids.
 */
export default class ProjectListMapComponent extends Component {
  /**
   * List of MapboxGL tile URL templates (/{x}/{y}/{z}.mvt|pbf)
   * @argument{Array}
   */
  tiles = [];

  /**
   * Used to switch the display mode of the projects, between centroid
   * and polygons modes.
   * @private
   */
  tileMode = 'centroid';

  /**
   * Parameterizes the list of urls with the current mode, centroid or polygons.
   * @private
   */
  @computed('tiles', 'tileMode')
  get tilesForZoom() {
    return this.tiles.map(url => `${url}?type=${this.tileMode}`);
  }

  /**
   * Updates the tile mode based on the map's zoom. Bound to the map instance in
   * the template itself.
   * @private
   */
  @action
  computeTileMode(e) {
    if (e.target.getZoom() > expandToPolygonZoomThreshold) {
      this.set('tileMode', 'polygons');
    } else {
      this.set('tileMode', 'centroid');
    }
  }

  /**
   * MapboxGL style configuration for polygons
   */
  projectPolygonsLayer = projectPolygonsLayer;

  /**
   * MapboxGL style configuration for centroids
   */
  projectCentroidsCircleLayer = projectCentroidsCircleLayer;

  /**
   * MapboxGL style configuration for hovering centroids
   */
  projectCentroidsCircleHoverLayer = projectCentroidsCircleHoverLayer;

  /**
   * MapboxGL style configuration for hovering polygons
   */
  projectPolygonsHoverLayer = projectPolygonsHoverLayer;
}
