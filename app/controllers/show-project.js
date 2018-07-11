import Controller from '@ember/controller';
import mapboxgl from 'mapbox-gl';
import { action, computed } from '@ember-decorators/object';
import turfBbox from '@turf/bbox';

export default class ShowProjectController extends Controller {
  bblFeatureCollectionLayer = {
    "id": "bbl-feature-collection-fill",
    "type": "line",
    "layout": {
      'line-cap': 'round',
    },
    "paint": {
      'line-opacity': 0.9,
      'line-color': 'rgba(0, 10, 90, 1)',
      'line-width': {
        stops: [
          [
            14,
            2,
          ],
          [
            19,
            7,
          ],
        ],
      },
      'line-dasharray': [
        2,
        1.5,
      ],
    },
  }

  @computed()
  get isFiled() {
    return this.get('model.dcp_publicstatus') === 'Filed';
  }

  @action
  handleMapLoad(bblFeatureCollection, map) {
    window.map = map;

    const navigationControl = new mapboxgl.NavigationControl();
    map.addControl(navigationControl, 'top-left');

    map.fitBounds(turfBbox(bblFeatureCollection), {
      padding: 50,
      linear: true,
      duration: 0,
    });
  }
}
