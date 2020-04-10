import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import deepmerge from 'deepmerge';
import { classNames } from '@ember-decorators/component';

// default mapbox instance stub with a few common methods. this is incomplete,
// usually the methods should be added to specific tests
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
    areTilesLoaded: () => true,
  },
};

// define a new mapbox-gl class with the layout also stubbed in.
// this will replace the ember-mapbox-gl bindings during tests
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

  // this is a layout stub which is necessary to replace contextual components
  // that descend from {{mapbox-gl}}
  // as more ember-mapbox-gl contextual components are needed for stubbing,
  // they must be added here
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

// blank ember-mapbox-gl mapbox-gl-source class, acts as "no op"
export class MapboxSource extends Component {
}

// stub for mapbox-gl-on, the ember-mapbox-gl interface for binding events
export class MapboxOn extends Component {
  // this component gets "positional params" so that it can be invoked as follows:
  // {{map.on 'someEvent' (action 'myAction')}}
  static positionalParams = ['event', 'action'];

  // see mapbox-gl stub class - the layout hands a reference to itself down
  map;

  // the core functionality of mapbox-gl-on is handled on init by binding
  // the passed event name with the passed action.
  // bindOnInvocation is used to pull in test context the moment the event itself is
  // triggered (rather than being pulled in on initialization)
  init(...args) {
    this.map.element.addEventListener(this.event, this.bindOnInvocation.bind(this));

    super.init(...args);
  }

  // helper function referenced in init which allows for the test context
  // to be pulled in the moment the event is triggered and the action is run
  // uses deepMerge to merge in the defaults with whatever the test context provides
  bindOnInvocation() {
    return (() => {
      const currentMock = deepmerge(defaultMapboxEventStub, this.map.testContext.mapboxEventStub || {});

      return this.action.bind(this, currentMock)();
    })();
  }
}

// main export used in qunit tests to pull in the mapbox-gl stub
// `setupMapboxStubs(hooks);`
// This also defines an extension of the mapbox-gl stub so that the
// test context can be pulled in.
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

    // ember/qunit interface for stubbing in the above classes, replacing
    // the mapbox-gl dependencies in test mode
    this.owner.register('component:mapbox-gl-on', MapboxOn);
    this.owner.register('component:mapbox-gl-source', MapboxSource);
    this.owner.register('component:mapbox-gl', MapboxGlStub);
  });
}
