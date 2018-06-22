import Component from '@ember/component';
import mapboxgl from 'mapbox-gl';
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

  tooltipPoint = { x: 0, y: 0 }

  highlightedFeature = null

  popup = new mapboxgl.Popup({
   closeOnClick: false,
 })


  didUpdateAttrs() {
    // https://github.com/mapbox/mapbox-gl-js/issues/3709#issuecomment-265346656
    const map = this.get('map');

    if (map) {
      const newStyle = map.getStyle();
      const metaTiles = this.get('meta.tiles');
      const bounds = this.get('meta.bounds');

      if (metaTiles) {
        newStyle.sources['project-centroids'].tiles = this.get('meta.tiles');
        map.setStyle(newStyle);
        map.fitBounds(bounds, { padding: 20 });
      }
    }
  }

  @action
  handleMapLoad(map) {
    window.map = map;
    this.set('map', map)

    const tiles = this.get('meta.tiles');
    const bounds = this.get('meta.bounds');

    if (tiles) {
      this.map.addSource('project-centroids',{
        type: 'vector',
        tiles,
      });

      this.map.addLayer(this.get('projectCentroidsLayer'));
      map.fitBounds(bounds, { padding: 20 });
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
      this.set('highlightedFeature', feature);

      this.set('tooltipPoint', {
        x: e.point.x + 20,
        y: e.point.y + 20,
      });

      map.getCanvas().style.cursor = 'pointer';

    } else {
      this.set('highlightedFeature', null);

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
