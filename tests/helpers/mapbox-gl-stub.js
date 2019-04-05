import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import deepmerge from 'deepmerge';

const defaultMapboxEventStub = {
  target: {
    getZoom: () => {},
    queryRenderedFeatures: () => [],
    unproject: () => ({ lat: 0, lng: 0 }),
    addControl: () => {},
    getCanvas: () => ({
      style: {},
    }),
  },
};

export class MapboxGl extends Component {
  mapLoaded = () => {}

  init(...args) {
    super.init(...args);

    // mapLoaded is an ember-mapbox-gl convenience
    // which specifically sends out the "target"
    // as the map instance
    this.mapLoaded(this.mapboxEventStub.target);
  }

  layout = hbs`
    {{yield (hash
      on=(component 'mapbox-gl-on' mapboxEventStub=mapboxEventStub)
      source=(component 'mapbox-gl-source' mapboxEventStub=mapboxEventStub)
    )}}
  `;
}

export class MapboxSourceStub extends Component {}

export class MapboxOnStub extends Component {
  static positionalParams = ['event', 'action'];

  init(...args) {
    super.init(...args);

    this.action(this.mapboxEventStub);
  }
}

export default function(hooks) {
  hooks.beforeEach(function() {
    const that = this;
    // allow the mouse event callback function signature be injected
    // via each test run, overriding default no-ops
    class MapboxGlStub extends MapboxGl {
      init(...args) {
        this.mapboxEventStub = deepmerge(defaultMapboxEventStub, that.mapboxEventStub || {});

        super.init(...args);
      }
    }

    this.owner.register('component:mapbox-gl-on', MapboxOnStub);
    this.owner.register('component:mapbox-gl-source', MapboxSourceStub);
    this.owner.register('component:mapbox-gl', MapboxGlStub);
  });
}
