import Component from '@ember/component';
import mapboxgl from 'mapbox-gl';
import { action, computed } from '@ember-decorators/object';
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
  @argument geosearchText = '';
  @argument geocodedCoordinates = [];
  @argument initOptions = {
    zoom: 12,
    center: [-73.96532400540775, 40.709710016659386],
  };

  tooltipPoint = { x: 0, y: 0 };

  highlightedFeature = null;

  @computed('geocodedCoordinates')
  get geocodedFeature() {
    const { geocodedCoordinates: [x, y] } = this;

    return (x && y) ? { 
      type: 'geojson', 
      data: {
        type: 'Point',
        coordinates: [x, y],
      },
    } : null; 
  }

  geocodedLayer = {
    type: 'circle',
    paint: {
      'circle-radius': {
        "stops": [
          [
            10,
            5
          ],
          [
            17,
            12
          ]
        ]
      },
      'circle-color': 'rgba(199, 92, 92, 1)',
      'circle-stroke-width': {
        "stops": [
          [
            10,
            20
          ],
          [
            17,
            18
          ]
        ]
      },
      'circle-stroke-color': 'rgba(65, 73, 255, 1)',
      'circle-opacity': 0,
      'circle-stroke-opacity': 0.2
    }
  };

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
    this.resultMapEvents.on('click', this, 'clickPoint')
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
  selectSearchResult({ geometry, label }) {
    const { coordinates } = geometry;
    const { mapInstance: map } = this;

    this.setProperties({ 
      geosearchText: label,
      geocodedCoordinates: coordinates,
    });

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
