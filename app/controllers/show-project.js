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

  // workaround for displaying "Revised Land Use Application..." for subsequent copies of the same milestone
  @computed('model.milestones')
  get revisedmilestones() {
    const { milestones } = this.model;
    let lastZapId = '';

    return milestones.map((milestone) => {
      if (
        milestone.zap_id === lastZapId
        && (
          milestone.zap_id === '663beec4-dad0-e711-8116-1458d04e2fb8'
          || milestone.zap_id === '783beec4-dad0-e711-8116-1458d04e2fb8'
        )
      ) {
        lastZapId = milestone.zap_id;
        milestone.display_name = `Revised ${milestone.display_name}`;
        return milestone;
      }

      lastZapId = milestone.zap_id;
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
