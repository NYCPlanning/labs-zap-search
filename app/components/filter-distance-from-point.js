import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { action, computed } from '@ember-decorators/object';
import { generateCircleFromFeet } from 'labs-zap-search/helpers/generate-circle-from-feet';

export default class FilterDistanceFromPoint extends Component {
  @argument
  map;

  @argument
  pointGeometry;

  @argument
  radius;

  @argument
  onRadiusFilterClick = () => {}

  @argument
  pointLayerId = 'project-centroids-circle';

  @argument
  shouldQueryFullMap = false;

  // geojson
  @computed('pointGeometry', 'radius')
  get circleFromRadius() {
    const { pointGeometry, radius } = this;

    return generateCircleFromFeet([pointGeometry, radius]);
  }

  // queries relevant layer for intersecting feature and sends it
  // to the click action. conditionally allows for clicking
  // anywhere on the map
  @action
  handleClick(e) {
    const { target: map } = e;
    const { point } = e;
    const [feature] = map.queryRenderedFeatures(
      point,
      { layers: [this.pointLayerId] },
    );

    if (feature) {
      const { geometry: { coordinates } } = feature;

      this.onRadiusFilterClick(coordinates);
    } else if (this.shouldQueryFullMap) {
      const { lng, lat } = map.unproject(point);

      this.onRadiusFilterClick([lng, lat]);
    }
  }
}
