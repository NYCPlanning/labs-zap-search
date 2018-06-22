import Component from '@ember/component';
import { action } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { service } from '@ember-decorators/service';
import { restartableTask } from 'ember-concurrency-decorators';
import carto from 'cartobox-promises-utility/utils/carto';

export default class ProjectsMapComponent extends Component {
  @service router;

  @argument meta;

  projectCentroidsLayer = {
    id: 'project-centroids-circle',
    type: 'circle',
    'source': 'project-centroids',
    'source-layer': 'project-centroids',
    paint: {
      'circle-radius': { stops: [[10, 3], [15, 4]] },
      'circle-color': '#ae561f',
      'circle-opacity': 1,
      'circle-stroke-width': { stops: [[10, 1], [15, 2]] },
      'circle-stroke-color': '#FFFFFF',
    },
  }

  @restartableTask
  projectCentroidsSource = function*() {
    const sourceLayers = [{
      id: 'project-centroids',
      sql: 'SELECT * FROM project_centroids',
    }];

    const tileURL = yield carto.getVectorTileTemplate(sourceLayers);

    return {
      type: 'vector',
      tiles: [tileURL],
    };
  }

  didUpdateAttrs() {
    console.log('update attrs')
    // https://github.com/mapbox/mapbox-gl-js/issues/3709#issuecomment-265346656
    const map = this.get('map');
    var newStyle = map.getStyle();
    newStyle.sources['project-centroids'].tiles = this.get('meta.tiles');
    map.setStyle(newStyle);

    map.fitBounds(this.get('meta.bounds'), {padding: 20});

  }

  @action
  handleMapLoad(map) {
    window.map = map;
    this.set('map', map)
    // this.get('projectCentroidsSource').perform();
    console.log(this.get('meta'))

    this.map.addSource('project-centroids',{
      type: 'vector',
      tiles: this.get('meta.tiles'),
    });

    this.map.addLayer(this.get('projectCentroidsLayer'))
    console.log(this.get('meta.bounds'))
    map.fitBounds(this.get('meta.bounds'), {padding: 20});
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
      this.get('router').transitionTo('show-project', projectid);
    }
  }
}
