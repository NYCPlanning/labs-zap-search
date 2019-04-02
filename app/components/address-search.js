import Component from '@ember/component';
import { action } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';

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

export default class AddressSearch extends Component {
  @argument
  map;

  @argument
  onSelectSearchResult = () => {}

  geocodedGeometry = null;

  geocodedLayer = geocodedLayer;

  @action
  selectSearchResult(result) {
    this.set('geocodedGeometry', result.geometry);

    // notify that a search result has been selected
    this.onSelectSearchResult(result);
  }
}
