import Component from '@ember/component';
import mapboxgl from 'mapbox-gl';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { restartableTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import Ember from 'ember';

/**
  ProjectsMapComponent manages mapbox-gl-js specific configuration objects, tooltip hovering
  logic, and event bus management (the hovering animation between the project list and this).
 */
export default class ProjectsMapComponent extends Component {
  /**
   * Event bus service that manages the mouse hover logic between this
   * component and the projects list component.
   * @private
   */
  @service resultMapEvents;

  /**
   * Event that is triggered when user clicks the map. Provides the clicked feature,
   * if there is one, which is specifically scoped to a particular layer ID. Also provides
   * the raw click event.
   * @public
   */
  onMapClick = (/* feature, e */) => {};

  /**
   * Screen coordinates used to position the tooltip DOM element
   * @private
   */
  tooltipPoint = { x: 0, y: 0 };

  /**
   * Currently highlighted feature in GeoJSON format.
   * @private
   */
  highlightedFeature = null;

  /**
   * Updated continuously by updateTileState. True when
   * tiles are loading, false when loaded. Used to display
   * a load spinner
   */
  tilesLoading = true;

  /**
   * Task-decorated generator function (see http://ember-concurrency.com/)
   *
   * updateTileState runs continuously to update the tilesLoading field.
   * Triggered initially by handleMapLoad, once the map instance is available.
   */
  @restartableTask
  updateTileState = function* (map) {
    while (true) {
      yield timeout(500);

      this.set('tilesLoading', !map.areTilesLoaded());

      // Required for Ember testing to know when it's done rendering
      // See: http://ember-concurrency.com/docs/testing-debugging/
      if (Ember.testing) return;
    }
  }

  /**
   * Handler passed into {{mapbox-gl}} which is necessary for grabbing a reference to the raw
   * mapbox-gl-js instance. Triggered when mapbox-gl loads, and sets up a lot of the mapbox-gl-js
   * specific modules like navigation and geolocation.
   *
   * Binds click and hover events to the resultMapEvents service.
   * @private
   */
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

    this.updateTileState.perform(map);
  }

  /**
   * Handler passed to ember-mapbox-gl which checks that a project dot is hovered
   * and then sets hovered geometry information so that it gets displayed and
   * fills in tooltip with content.
   * @private
   */
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

  /**
   * Triggers the public `onMapClick` event with the intersecting feature if it exists,
   * plus the original map event
   * @private
   */
  @action
  handleMapClick(e) {
    const map = e.target;
    const [feature] = map.queryRenderedFeatures(
      e.point,
      { layers: ['project-centroids-circle'] },
    );

    this.onMapClick(feature, e);
  }

  /**
   * Specific to the resultMapEvents service. Once triggered, interacts directly
   * with the mapbox-gl instance, updating internal state.
   * @private
   */
  hoverPoint({ id, layerId }) {
    this.mapInstance
      .setLayoutProperty(layerId, 'visibility', 'visible')
      .setPaintProperty('project-centroids-circle', 'circle-blur', 0.9)
      .setFilter(layerId, ['==', ['get', 'projectid'], id]);
  }

  /**
   * Specific to the resultMapEvents service. Once triggered, interacts directly
   * with the mapbox-gl instance, updating internal state.
   * @private
   */
  unHoverPoint({ layerId }) {
    this.mapInstance
      .setPaintProperty('project-centroids-circle', 'circle-blur', 0)
      .setLayoutProperty(layerId, 'visibility', 'none');
  }

  /**
   * Specific to the resultMapEvents service. Once triggered, interacts directly
   * with the mapbox-gl instance, updating internal state.
   * @private
   */
  clickPoint({ project }) {
    const { mapInstance: map } = this;
    const { center } = project;

    map.flyTo({ center, zoom: 15 });
  }

  /**
   * Overrides component lifecycle hook. Used to unregister the bound resultMapEvents events.
   * @private
   */
  willDestroyElement() {
    this.resultMapEvents.off('hover', this, 'hoverPoint');
    this.resultMapEvents.off('unhover', this, 'unHoverPoint');

    this.updateTileState.cancelAll();
  }
}
