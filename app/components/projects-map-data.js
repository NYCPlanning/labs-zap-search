import Component from '@ember/component';
import mapboxgl from 'mapbox-gl';
import { action } from '@ember-decorators/object';
// import { argument } from '@ember-decorators/argument';
import { inject as service } from '@ember-decorators/service';

export default class ProjectsMapComponent extends Component {
  @service router;

  @service resultMapEvents;

  // required
  // @argument
  meta = {};

  tooltipPoint = { x: 0, y: 0 };

  highlightedFeature = null;

  popup = new mapboxgl.Popup({
    closeOnClick: false,
  });

  // @argument
  onMapClick = () => {};

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
    this.resultMapEvents.on('click', this, 'clickPoint');
  }

  @action
  handleMouseMove(e) {
    const map = e.target;
    const [feature] = map.queryRenderedFeatures(
      e.point,
      { layers: ['project-centroids-circle', 'project-polygons-fill'] },
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
    const map = e.target;
    const [feature] = map.queryRenderedFeatures(
      e.point,
      { layers: ['project-centroids-circle'] },
    );

    this.onMapClick(feature, e);
  }

  hoverPoint({ id, layerId }) {
    this.mapInstance
      .setLayoutProperty(layerId, 'visibility', 'visible')
      .setPaintProperty('project-centroids-circle', 'circle-blur', 0.9)
      .setFilter(layerId, ['==', ['get', 'projectid'], id]);
  }

  unHoverPoint({ layerId }) {
    this.mapInstance
      .setPaintProperty('project-centroids-circle', 'circle-blur', 0)
      .setLayoutProperty(layerId, 'visibility', 'none');
  }

  clickPoint({ project }) {
    const { mapInstance: map } = this;
    const { center } = project;

    map.flyTo({ center, zoom: 15 });
  }

  willDestroyElement() {
    this.resultMapEvents.off('hover', this, 'hoverPoint');
    this.resultMapEvents.off('unhover', this, 'unHoverPoint');
  }
}
