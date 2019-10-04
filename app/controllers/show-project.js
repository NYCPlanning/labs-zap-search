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

  showPopup = false;

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

  @computed('user', 'model')
  get isUserAssignedToProject() {
    // user is from currentUser Service
    // currentUser Service injected in show-project route on setUpController
    if (this.session.isAuthenticated) {
      const user = this.get('user');
      const currentProject = this.get('model');

      const userProjectIds = user.projects.map(proj => proj.dcpName);

      // check that current project is in userProjectIds array
      const isUserAssigned = userProjectIds.includes(currentProject.dcpName);

      return isUserAssigned;
    } return false;
  }

  // if the each dcpPublichearinglocation and dcpDateofpublichearing properties are filled in dispositions array,
  // then hearings have been submitted for that project
  @computed('model.dispositions.@each.{dcpPublichearinglocation,dcpDateofpublichearing}')
  get hearingsSubmitted() {
    const dispositions = this.get('model.dispositions');
    // array of hearing locations
    const dispositionHearingLocations = dispositions.map(disp => `${disp.dcpPublichearinglocation}`);
    // array of hearing dates
    const dispositionHearingDates = dispositions.map(disp => disp.dcpDateofpublichearing);
    // hearingsSubmittedForProject checks whether each item in array is truthy
    const hearingsSubmittedForProject = dispositionHearingLocations.every(location => !!location) && dispositionHearingDates.every(date => !!date);
    return hearingsSubmittedForProject;
  }

  // if all dcpPublichearinglocation in dispositions array equal "waived",
  // then hearings have been waived
  @computed('model.dispositions.@each.dcpPublichearinglocation')
  get hearingsWaived() {
    const dispositions = this.get('model.dispositions');
    // array of hearing locations
    const dispositionHearingLocations = dispositions.map(disp => `${disp.dcpPublichearinglocation}`);
    // each location field equal to 'waived'
    const hearingsWaived = dispositionHearingLocations.every(location => location === 'waived');
    return hearingsWaived;
  }

  @computed('hearingsSubmitted', 'hearingsWaived')
  get hearingsSubmittedOrWaived() {
    const hearingsSubmitted = this.get('hearingsSubmitted');
    const hearingsWaived = this.get('hearingsWaived');
    return !!hearingsSubmitted || !!hearingsWaived;
  }

  @computed('hearingsSubmitted', 'hearingsWaived')
  get hearingsNotSubmittedNotWaived() {
    const hearingsSubmitted = this.get('hearingsSubmitted');
    const hearingsWaived = this.get('hearingsWaived');
    return !hearingsSubmitted && !hearingsWaived;
  }

  @action
  openOptOutHearingPopup() {
    this.set('showPopup', true);
  }

  @computed('model.bblFeaturecollection')
  get hasBBLFeatureCollectionGeometry() {
    return this.model.bblFeaturecollection.features.length
    && this.model.bblFeaturecollection.features[0].geometry;
  }

  @action
  handleMapLoad(map) { // eslint-disable-line
    window.map = map;

    const navigationControl = new mapboxgl.NavigationControl();
    map.addControl(navigationControl, 'top-left');

    map.fitBounds(turfBbox(turfBuffer(this.model.bblFeaturecollection.features[0], 0.075)), {
      linear: true,
      duration: 0,
    });
  }
}
