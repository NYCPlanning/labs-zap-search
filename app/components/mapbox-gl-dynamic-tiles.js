import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';

export default class MapboxGlDynamicTilesComponent extends Component {
  @argument
  map;

  @argument
  tiles;

  @argument
  layer;

  @argument
  mapInstance;

  didUpdateAttrs() {
    const map = this.get('mapInstance');
    const newStyle = map.getStyle();
    const tiles = this.get('tiles');

    newStyle.sources['project-centroids'].tiles = tiles;
    map.setStyle(newStyle);
  }
}
