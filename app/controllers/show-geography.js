import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';
import carto from 'cartobox-promises-utility/utils/carto';

export default class ShowGeographyController extends Controller {
  queryParams = ['community-district', 'dcp_projectstatus'];
  page = 1;
  dcp_publicstatus = ['Approved', 'Withdrawn', 'Filed', 'Certified', 'Unknown'];

  transformRequest(url) {
    window.XMLHttpRequest = window.XMLHttpRequestNative;
    return { url };
  }

  projectCentroidsTileTemplate = null

  projectCentroidsLayer = {
    id: 'project-centroids-circle',
    type: 'circle',
    'source-layer': 'project-centroids',
    paint: {
      'circle-radius': { stops: [[10, 3], [15, 4]] },
      'circle-color': '#ae561f',
      'circle-opacity': 1,
      'circle-stroke-width': { stops: [[10, 1], [15, 2]] },
      'circle-stroke-color': '#FFFFFF',
    },
  }

  @computed('projectCentroidsTileTemplate')
  get projectCentroidsSource() {
    return {
      type: 'vector',
      tiles: [this.get('projectCentroidsTileTemplate')],
    }
  }

  @action
  handleMapLoad(bblFeatureCollection, map) {
    window.map = map;
    this.set('map', map)
    // initiate carto handshake
    const sourceLayers = [{
      id: 'project-centroids',
      sql: 'SELECT * FROM project_centroids',
    }];

    carto.getVectorTileTemplate(sourceLayers)
      .then((tileTemplate) => {
        this.set('projectCentroidsTileTemplate', tileTemplate)
      });
  }

  @action
  handleMapMove(e) {
    // show a pointer cursor if there is a feature under the mouse pointer
    const map = this.get('map');
    const Feature = map.queryRenderedFeatures(
      e.point,
      { layers: ['project-centroids-circle']}
    )[0];

    if (Feature) {
      map.getCanvas().style.cursor = 'pointer';
    } else {
      map.getCanvas().style.cursor = 'default';
    }
  }

  @action
  handleMapClick(e) {
    const map = this.get('map');
    const Feature = map.queryRenderedFeatures(
      e.point,
      { layers: ['project-centroids-circle']}
    )[0];

    if (Feature) {
      const projectid = Feature.properties.projectid;
      this.transitionToRoute('show-project', projectid);
    }
  }

  @action
  mutateArray(key, value) {
    const values = this.get(key);

    // reset pagination
    this.set('page', 1);
    this.get('store').unloadAll('project');

    if (values.includes(value)) {
      values.removeObject(value);      
    } else {
      values.pushObject(value);
    }
  }
}
