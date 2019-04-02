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

  @action
  handleRadiusFilterClick(e) {
    const map = e.target;
    const { lng, lat } = map.unproject(e.point);

    this.onRadiusFilterClick([lng, lat]);
  }
}
