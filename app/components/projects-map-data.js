import Component from '@ember/component';
import mapboxgl from 'mapbox-gl';
import { action } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { service } from '@ember-decorators/service';

export default class ProjectsMapComponent extends Component {
  constructor() {
    super(...arguments);
  }

  @service router;
  @service resultMapEvents;

  // required
  @argument meta = {};

  tooltipPoint = { x: 0, y: 0 }

  highlightedFeature = null;
  geocodedFeature = null;
  geocodedLayer = {
    type: 'circle',
    paint: {
      'circle-radius': 8,
      'circle-color': '#007cbf',
      'circle-stroke-width': { stops :  [ [10, 1], [15, 2]] },
      'circle-stroke-color': '#FFFFFF',
    }
  }

  popup = new mapboxgl.Popup({
   closeOnClick: false,
  });

  @action
  handleMapLoad(map) {
    window.map = map;
    this.set('mapInstance', map);

    const navigationControl = new mapboxgl.NavigationControl();
    map.addControl(navigationControl, 'top-left');

    const geoLocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    map.addControl(geoLocateControl, 'top-left');

    this.resultMapEvents.on('hover', this, 'hoverPoint');
    this.resultMapEvents.on('unhover', this, 'unHoverPoint');
  }

  @action
  handleMouseMove(e) {
    const map = this.mapInstance;
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
    const map = this.mapInstance;
    const [feature] = map.queryRenderedFeatures(
      e.point,
      { layers: ['project-centroids-circle'] }
    );

    if (feature) {
      const projectid = feature.properties.projectid;
      this.router.transitionTo('show-project', projectid);
    }
  }

  @action
  selectSearchResult({ geometry }) {
    const { coordinates } = geometry;
    const { mapInstance: map } = this;

    this.set('geocodedFeature', { type: 'geojson', data: geometry });
    map.flyTo({ center: coordinates, zoom: 16 });
  }

  hoverPoint({ id, layerId }) {
    this.mapInstance
      .setLayoutProperty(layerId, 'visibility', 'visible')
      .setPaintProperty('project-centroids-circle', 'circle-blur', 0.9)
      .setFilter(layerId, ["==", ["get", "projectid"], id]);
  }

  unHoverPoint({ layerId }) {
    this.mapInstance
      .setPaintProperty('project-centroids-circle', 'circle-blur', 0)
      .setLayoutProperty(layerId, 'visibility', 'none');
  }

  willDestroyElement() {
    this.resultMapEvents.off('hover', this, 'hoverPoint');
    this.resultMapEvents.off('unhover', this, 'unHoverPoint');
  }
}
