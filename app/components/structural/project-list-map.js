import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { computed, action } from '@ember-decorators/object';
import { restartableTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';

export default class ProjectListMapComponent extends Component {
  @argument geosearchText = '';
  @argument geocodedCoordinates = [];
  @argument mapCenter = [];
  @argument zoom;
  @argument tiles = [];
  @argument bounds = [];
  @argument queryParamsState = {};

  @computed('zoom', 'mapCenter')
  get initOptions() {
    const { mapCenter: center, zoom } = this;

    return { center, zoom };
  }

  @restartableTask
  updateMapState = function*(map) {
    yield timeout(750);

    this.set('mapCenter', Object.values(map.getCenter()));
    this.set('zoom', map.getZoom());
  }

  @action
  updateCenterZoom({ target: map }) {
    this.updateMapState.perform(map);
  }

  fitBoundsOptions = {
    padding: 20,
  }

  projectCentroidsCircleLayer = {
    id: 'project-centroids-circle',
    type: 'circle',
    source: 'project-centroids',
    'source-layer': 'project-centroids',
    paint: {
      'circle-radius': { 
        stops: [[10, 3], [15, 4]],
      },
      'circle-color': {
        property: 'dcp_publicstatus_simp',
        type: 'categorical',
        stops: [ 
          ['Filed', '#FF9400'],
          ['In Public Review', '#78D271'],
          ['Completed', '#44A3D5'],
        ],
        default: '#6b717b',
      },
      'circle-opacity': 1,
      'circle-stroke-width': { stops :  [ [10, 1], [15, 2]] },
      'circle-stroke-color': '#FFFFFF',
    }
  }

  projectCentroidsCircleHoverLayer = {
    id: 'project-centroids-circle-hover',
    type: 'circle',
    source: 'project-centroids',
    'source-layer': 'project-centroids',
    layout: { visibility: 'none' },
    paint: {
      'circle-radius': 5,
      'circle-color': '#ae561f',
      'circle-opacity' :  1,
      'circle-stroke-width' :  { stops: [[10, 1], [15, 2]] },
      'circle-stroke-color' :  '#FFFFFF',
    }
  }
}
