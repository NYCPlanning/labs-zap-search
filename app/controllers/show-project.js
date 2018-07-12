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

  // workaround for displaying "Revised Land Use Application..." for subsequent copies of the same milestone
  @computed('model.milestones')
  get revisedmilestones() {
    const { milestones } = this.model;
    let filedCounter = 0;
    return milestones.map((milestone) => {
      if (milestone.milestonename === 'Land Use Application Filed Review') {
        filedCounter += 1;
        if (filedCounter > 1) milestone.milestonename = 'Revised Land Use Application Filed Review';
        return milestone;
      }

      return milestone
    })
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
