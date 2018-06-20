import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';
import carto from 'cartobox-promises-utility/utils/carto';
import QueryParams from 'ember-parachute';

export const projectParams = new QueryParams({
  page: {
    defaultValue: 1,
    refresh: true,
  },
  'community-district': {
    defaultValue: '',
    refresh: true,
  },
  'community-districts': {
    defaultValue: [],
    refresh: true,
    serialize(value) {
      return value.toString();
    },
    deserialize(value = '') {
      return value.split(',');
    },
  },
  dcp_publicstatus: {
    defaultValue: ['Approved', 'Certified', 'Filed', 'Unknown', 'Withdrawn'].sort(),
    refresh: true,
    serialize(value) {
      return value.toString();
    },
    deserialize(value = '') {
      return value.split(',').sort();
    },
  },
  dcp_ceqrtype: {
    defaultValue: ['Type I', 'Type II', 'Unlisted', 'Unknown'].sort(),
    refresh: true,
    serialize(value) {
      return value.toString();
    },
    deserialize(value = '') {
      return value.split(',').sort();
    },
  },
  dcp_ulurp_nonulurp: {
    defaultValue: ['ULURP', 'Non-ULURP'].sort(),
    refresh: true,
    serialize(value) {
      return value.toString();
    },
    deserialize(value = '') {
      return value.split(',').sort();
    },
  },
  dcp_femafloodzonea: {
    defaultValue: false,
    refresh: true,
  },
  dcp_femafloodzonecoastala: {
    defaultValue: false,
    refresh: true,
  },
  dcp_femafloodzoneshadedx: {
    defaultValue: false,
    refresh: true,
  },
  dcp_femafloodzonev: {
    defaultValue: false,
    refresh: true,
  },
});

const ParachuteController = Controller.extend(projectParams.Mixin);

export default class ShowGeographyController extends ParachuteController {
  // map for projects
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
        if (!this.get('isDestroyed')) {
          this.set('projectCentroidsTileTemplate', tileTemplate)
        }
      });
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

  // project filters
  @computed('meta.total', 'page')
  get noMoreRecords() {
    const pageTotal = this.get('meta.pageTotal');
    const total = this.get('meta.total');
    const page = this.get('page');

    return (pageTotal < 30) || ((page * 30) === total);
  }

  @action
  resetPagination() {
    // reset pagination
    this.set('page', 1);
    this.get('store').unloadAll('project');
  }

  @action
  mutateArray(key, value) {
    const values = this.get(key);

    this.resetPagination();

    if (values.includes(value)) {
      values.removeObject(value);
    } else {
      values.pushObject(value);
    }
  }


  @action
  replaceProperty(key, value = []) {
    this.resetPagination();

    this.set(key, value.map(({ code }) => code));
  }

  @action
  toggleBoolean(key) {
    this.resetPagination();

    this.set(key, !this.get(key));
  }
}
