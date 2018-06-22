import Component from '@ember/component';
import { action } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { service } from '@ember-decorators/service';

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

  didUpdateAttrs() {
    const map = this.get('map');

    if (map) {
      const newStyle = map.getStyle();
      const metaTiles = this.get('meta.tiles');

      if (metaTiles) {
        newStyle.sources['project-centroids'].tiles = this.get('meta.tiles');
        map.setStyle(newStyle);
      }
    }
  }

  @action
  handleMapLoad(map) {
    window.map = map;
    this.set('map', map);
    const tiles = this.get('meta.tiles');

    if (tiles) {
      this.map.addSource('project-centroids',{
        type: 'vector',
        tiles,
      });

      this.map.addLayer(this.get('projectCentroidsLayer'));
    }
  }

  @action
  handleMapMove(e) {
    const map = this.get('map');
    const [feature] = map.queryRenderedFeatures(
      e.point,
      { layers: ['project-centroids-circle'] }
    );

    if (feature) {
      map.getCanvas().style.cursor = 'pointer';
    } else {
      map.getCanvas().style.cursor = 'default';
    }
  }

  @action
  handleMapClick(e) {
    const map = this.get('map');
    const [feature] = map.queryRenderedFeatures(
      e.point,
      { layers: ['project-centroids-circle'] }
    );

    if (feature) {
      const projectid = feature.properties.projectid;
      this.get('router').transitionTo('show-project', projectid);
    }
  }
}
