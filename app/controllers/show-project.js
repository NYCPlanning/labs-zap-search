import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import mapboxgl from 'mapbox-gl';
import { action, computed } from '@ember/object';
import turfBbox from '@turf/bbox';
import turfBuffer from '@turf/buffer';
import moment from 'moment';

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

  @computed('project.actualenddate')
  get timeRemaining() {
    const endDate = this.get('project.actualenddate');
    console.log(endDate);

    return moment(endDate).endOf('day').fromNow('day');
  }

  @computed('project.actualenddate,project.actualstartdate')
  get timeDuration() {
    const endDate = this.get('project.actualenddate');
    const startDate = this.get('project.actualstartdate');

    return moment(endDate) - moment(startDate);
  }

  @computed('user', 'model')
  get isUserAssignedToProject() {
    // user is from currentUser Service
    // currentUser Service injected in show-project route on setUpController
    if (this.session.isAuthenticated) {
      const user = this.get('user');
      const currentProject = this.get('model');

      const userProjectIds = user.projects.map(proj => proj.dcp_name);

      // check that current project is in userProjectIds array
      const isUserAssigned = userProjectIds.includes(currentProject.dcp_name);

      return isUserAssigned;
    } return false;
  }

  @computed('model')
  get hearingsSubmitted() {
    const dispositions = this.get('model.dispositions');

    // a function to check if each hearing location/date field is truthy
    function infoExists(hearingInfo) {
      return hearingInfo;
    }

    const dispositionHearingLocations = dispositions.map(disp => `${disp.publichearinglocation}`);
    const dispositionHearingDates = dispositions.map(disp => disp.dateofpublichearing);
    // using function infoExists, fieldsFilled checks whether each item in array is truthy
    const hearingsSubmitted = dispositionHearingLocations.every(infoExists) && dispositionHearingDates.every(infoExists);

    return hearingsSubmitted;
  }

  @computed('hearingsSubmitted', 'model')
  get dedupedHearings() {
    const dispositions = this.get('model.dispositions');

    let deduped;
    const hearingsSubmitted = this.get('hearingsSubmitted');

    if (hearingsSubmitted) {
      deduped = dispositions.reduce((acc, current) => {
        const matchingProps = acc.find(item => item.publichearinglocation === current.publichearinglocation && item.dateofpublichearing.toString() === current.dateofpublichearing.toString());

        // if the properties DO match
        if (matchingProps) {
          // just return original object, WITHOUT concatenating the duplicate
          return acc;
        // if the properties DO NOT match
        // concatenate the new object onto the array
        } return acc.concat([current]);
      }, []);
    }

    return deduped;
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
