import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';
import turfBbox from 'npm:@turf/bbox';


export default class ShowProjectController extends Controller {
  transformRequest(url) {
    window.XMLHttpRequest = window.XMLHttpRequestNative;
    return { url };
  }


  bblFeatureCollectionLayer = {
    "id": "bbl-feature-collection-fill",
    "type": "fill",
    "paint": {
      'fill-color': 'rgba(81, 111, 217, 1)',
      'fill-opacity': 0.5,
      'fill-outline-color': 'rgba(255, 255, 255, 1)',
    },
  }

  @action
  handleMapLoad(bblFeatureCollection, map) {
    window.map = map;

    map.fitBounds(turfBbox.default(bblFeatureCollection), {
      padding: 10,
      linear: true,
      duration: 0,
    });

    console.log('map-loaded')

  }
}
