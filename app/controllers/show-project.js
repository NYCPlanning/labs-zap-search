import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { run } from '@ember/runloop';
import turfBbox from '@turf/bbox';


export default class ShowProjectController extends Controller {
  @argument shareURL = window.location.href;
  @argument shareClosed = true;
  @argument flagClosed = false;
  @argument copySuccess = false;

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

    map.fitBounds(turfBbox(bblFeatureCollection), {
      padding: 50,
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

  @action
  handleFlagOpen() {
    this.set('flagClosed', false);
  }

  @action
  handleFlagClose() {
    this.set('flagClosed', true);
    // this.set('copySuccess', false);
  }

  @action
  handleFlagSuccess() {
    // this.set('copySuccess', true);
    // run.later(() => {
    //   this.set('copySuccess', false);
    // }, 2000);
  }
}
