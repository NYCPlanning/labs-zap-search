import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import deepmerge from 'deepmerge';
import { classNames } from '@ember-decorators/component';

const defaultMapboxEventStub = {
  target: {
    getZoom: () => {},
    queryRenderedFeatures: () => [],
    unproject: () => ({ lat: 0, lng: 0 }),
    addControl: () => {},
    getCanvas: () => ({
      style: {},
    }),
    getStyle: () => ({
      sources: {},
      layers: {},
    }),
  },
};

@classNames('mapbox-gl')
export class MapboxGl extends Component {
  mapLoaded = () => {}

  init(...args) {
    super.init(...args);

    // mapLoaded is an ember-mapbox-gl convenience
    // which specifically sends out the "target"
    // as the map instance
    const currentMock = deepmerge(defaultMapboxEventStub, this.testContext.mapboxEventStub || {});

    this.mapLoaded(currentMock.target);
  }

  layout = hbs`
    {{yield (hash
      on=(component 'mapbox-gl-on'
        map=this
        mapboxEventStub=mapboxEventStub
      )
      source=(component 'mapbox-gl-source'
        map=this
        mapboxEventStub=mapboxEventStub
      )
    )}}
  `;
}

export class MapboxSource extends Component {
}

export class MapboxOn extends Component {
  static positionalParams = ['event', 'action'];

  map;

  bindOnInvocation() {
    return (() => {
      const currentMock = deepmerge(defaultMapboxEventStub, this.map.testContext.mapboxEventStub || {});

      return this.action.bind(this, currentMock)();
    })();
  }

  init(...args) {
    this.map.element.addEventListener(this.event, this.bindOnInvocation.bind(this));

    super.init(...args);
  }
}

export default function(hooks) {
  hooks.beforeEach(function() {
    const that = this;
    // extend stub and bind in the current test context so it can be
    // dynamically referenced
    class MapboxGlStub extends MapboxGl {
      testContext;

      init(...args) {
        this.testContext = that;

        super.init(...args);
      }
    }

    this.owner.register('component:mapbox-gl-on', MapboxOn);
    this.owner.register('component:mapbox-gl-source', MapboxSource);
    this.owner.register('component:mapbox-gl', MapboxGlStub);
  });
}
