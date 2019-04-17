import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { generateCircleFromFeet } from 'labs-zap-search/helpers/generate-circle-from-feet';

const POINT_LAYER_ID = 'project-centroids-circle';

/**
 * The FilterDistanceFromPoint component takes a point and radius as arguments, computes a geojson circle,
 * and handles click events from the map that locally query mapbox-gl for intersections triggers optional events.
 */
export default class FilterDistanceFromPoint extends Component {
  /**
   * {{ember-mapbox-gl}} contextual component hash, used in template. See https://github.com/kturney/ember-mapbox-gl.
   * @argument
   * @required
   */
  map;

  /**
   * Point coordinates for filter query
   * @argument{Array}
   * @required
   */
  pointGeometry;

  /**
   * Radius from point in feet
   * @argument
   * @required
   */
  radius;

  /**
   * Event triggered when map is clicked for the purpose of radius filter;
   * @argument
   * @public
   */
  onRadiusFilterClick = () => {}

  /**
   * Boolean flag telling the component whether to trigger click events for the entire map or
   * only when points are clicked;
   * @argument{Boolean}
   */
  shouldQueryFullMap = false;

  /**
   * Computed property returning a GeoJSON object used to represent a circle based on
   * the state of `pointGeometry` and `radius` properties;
   */
  @computed('pointGeometry', 'radius')
  get circleFromRadius() {
    const { pointGeometry, radius } = this;

    return generateCircleFromFeet([pointGeometry, radius]);
  }

  /**
   * Click handler action handed to mapbox-gl; when triggered, it queries the
   * "point layer", a mapbox-gl layer (determined by the constant, POINT_LAYER_ID),
   * for an intersecting feature and sends it to the click action.
   * Conditionally allows for clicking anywhere on the map.
   */
  @action
  handleClick(e) {
    const { target: map } = e;
    const { point } = e;
    const [feature] = map.queryRenderedFeatures(
      point,
      { layers: [POINT_LAYER_ID] },
    );

    // if there's a feature, extract the coordinates and trigger the click event
    // otherwise, if no feature, check if the component is set to `shouldQueryFullMap`
    // and trigger the event with the clicked latitude/longitude
    if (feature) {
      const { geometry: { coordinates } } = feature;

      this.onRadiusFilterClick(coordinates);
    } else if (this.shouldQueryFullMap) {
      const { lng, lat } = map.unproject(point);

      this.onRadiusFilterClick([lng, lat]);
    }
  }
}
