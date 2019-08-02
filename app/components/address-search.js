import Component from '@ember/component';
import { action } from '@ember/object';

export const geocodedLayer = {
  type: 'circle',
  paint: {
    'circle-radius': {
      stops: [
        [
          10,
          5,
        ],
        [
          17,
          12,
        ],
      ],
    },
    'circle-color': 'rgba(199, 92, 92, 1)',
    'circle-stroke-width': {
      stops: [
        [
          10,
          20,
        ],
        [
          17,
          18,
        ],
      ],
    },
    'circle-stroke-color': 'rgba(65, 73, 255, 1)',
    'circle-opacity': 0,
    'circle-stroke-opacity': 0.2,
  },
};

/**
 * The AddressSearch component is responsible for wrapping the {{labs-search}} addon component,
 * acting as a simplifed interface between it and the main app. It also exposes some public events.
 */
export default class AddressSearch extends Component {
  /**
   * {{ember-mapbox-gl}} contextual component hash, used in template. See https://github.com/kturney/ember-mapbox-gl.
   * @argument
   * @required
   */
  map;

  /**
   * Event triggered when a search result is selected via click or keypress.
   * @argument{Function}
   * @optional
   */
  onSelectSearchResult = () => {}

  /**
   * Event triggered when a user clears the search result.
   * @argument{Function}
   * @optional
   */
  onClearSearchResult = () => {}

  /**
   * GeoJSON object represented the selected result's geometric information
   * @private
   */
  geocodedGeometry = null;

  /**
   * Static JSON object for style configuration for geocoded search result
   * @private
   */
  geocodedLayer = geocodedLayer;

  /**
   * Action passed to {{labs-search}}; sets selected result and triggers the respective public event.
   * @private
   */
  @action
  selectSearchResult(result) {
    this.set('geocodedGeometry', result.geometry);

    // notify that a search result has been selected
    this.onSelectSearchResult(result);
  }

  /**
   * Action passed to {{labs-search}}; clears selected result and trigger the respective public event.
   * @private
   */
  @action
  clearSearchResult() {
    this.set('geocodedGeometry', null);
    this.onClearSearchResult();
  }
}
