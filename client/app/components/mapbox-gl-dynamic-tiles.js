import Component from '@ember/component';

/**
 * MapboxGlDynamicTilesComponent wraps the invocation of an ember-mapbox-gl
 * {{mapbox-gl-source}} component, and wires up downstream data updates
 * to enable the map to update when tile URLs are updated.
 */
export default class MapboxGlDynamicTilesComponent extends Component {
  /**
   * {{ember-mapbox-gl}} contextual component hash, used in template. See https://github.com/kturney/ember-mapbox-gl.
   * @argument
   * @required
   */
  map;

  /**
   * List of MapboxGL tile URL templates (/{x}/{y}/{z}.mvt|pbf)
   * @argument{Array}
   */
  tiles;

  // Raw mapbox-gl-js map instance.
  mapInstance;

  // @argument
  sourceId = 'project-centroids';

  didUpdateAttrs() {
    const map = this.mapInstance;
    const newStyle = map.getStyle();
    const { tiles } = this;

    newStyle.sources[this.sourceId].tiles = tiles;
    map.setStyle(newStyle);
  }
}
