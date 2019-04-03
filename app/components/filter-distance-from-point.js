import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { action } from '@ember-decorators/object';

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
