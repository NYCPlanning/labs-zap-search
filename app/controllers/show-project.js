import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { run } from '@ember/runloop';
import turfBbox from '@turf/bbox';


export default class ShowProjectController extends Controller {
  @argument shareURL = window.location.href;
  @argument shareClosed = true;
  @argument copySuccess = false;

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

    map.fitBounds(turfBbox(bblFeatureCollection), {
      padding: 10,
      linear: true,
      duration: 0,
    });
  }

  @action
  handleShareOpen() {
    this.set('shareClosed', false);
  }

  @action
  handleShareClose() {
    this.set('shareClosed', true);
    this.set('copySuccess', false);
  }

  @action
  handleShareSuccess() {
    this.set('copySuccess', true);
    run.later(() => {
      this.set('copySuccess', false);
    }, 2000);
  }
}
