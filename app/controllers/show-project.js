import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import mapboxgl from 'mapbox-gl';
import { action, computed } from '@ember/object';
import turfBbox from '@turf/bbox';
import turfBuffer from '@turf/buffer';

/**
 * The ShowProjectController is an EmberJS controller which handles the
 * ShowProjectRoute, which displays a single ZAP project. It includes a
 * computed property to alter the presetation of the project's milestones.
 */
export default class ShowProjectController extends Controller {
  @service
  session

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

  /**
   * Computed for revising the presentation of the project's milestones. The
   * show-project.hbs template uses this revised array of milestone objects
   * instead of the array in the model. This is a workaround for displaying
   * "Revised [displayName]" for recurring instances of certain milestones.
   * @returns {Object[]}
   */
  @computed('model.milestones')
  get revisedmilestones() {
    const { milestones } = this.model;
    let lastZapId = '';

    return milestones.map((milestone) => {
      if (
        milestone.milestone === lastZapId
        && (
          milestone.milestone === '663beec4-dad0-e711-8116-1458d04e2fb8' // "Land Use Application Filed"
          || milestone.milestone === '783beec4-dad0-e711-8116-1458d04e2fb8' // "Environmental Assessment Statement Filed"
        )
      ) {
        lastZapId = milestone.milestone;
        milestone.displayName = `Revised ${milestone.displayName}`;
        return milestone;
      }

      lastZapId = milestone.milestone;
      return milestone;
    });
  }

  @computed('model.bbl_featurecollection')
  get hasBBLFeatureCollectionGeometry() {
    return this.model.bbl_featurecollection.features.length
    && this.model.bbl_featurecollection.features[0].geometry;
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
