import Controller from '@ember/controller';
import mapboxgl from 'mapbox-gl';
import { action, computed } from '@ember-decorators/object';
import turfBbox from '@turf/bbox';
import turfBuffer from '@turf/buffer';


export default class ShowProjectController extends Controller {
  bblFeatureCollectionLayerFill = {
    id: 'project-geometry-fill',
    type: 'fill',
    paint: {
      'fill-color': 'rgba(237, 189, 18, 0.3)',
    },
  }

  bblFeatureCollectionLayerLine = {
    id: 'project-geometry-line',
    type: 'line',
    layout: {
      'line-cap': 'round',
    },
    paint: {
      'line-opacity': 0.9,
      'line-color': 'rgba(237, 189, 18, 0.9)',
      'line-width': 1,
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
    let easCounter = 0;

    return milestones.map((milestone) => {
      if (milestone.milestonename === 'Land Use Application Filed Review') {
        filedCounter += 1;
        if (filedCounter > 1) milestone.milestonename = 'Revised Land Use Application Filed Review';
        return milestone;
      }

      if (milestone.milestonename === 'Filed EAS Review') {
        easCounter += 1;
        if (easCounter > 1) milestone.milestonename = 'Revised Filed EAS Review';
        return milestone;
      }

      return milestone;
    });
  }


  @action
  handleMapLoad(map) { // eslint-disable-line
    window.map = map;

    const navigationControl = new mapboxgl.NavigationControl();
    map.addControl(navigationControl, 'top-left');

    map.fitBounds(turfBbox(turfBuffer(this.model.bbl_featurecollection.features[0], 0.075)), {
      linear: true,
      duration: 0,
    });
  }
}
