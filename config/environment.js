'use strict';

module.exports = function(environment) {
  const ENV = {
    modulePrefix: 'labs-zap-search',
    environment,
    rootURL: '/',
    locationType: 'router-scroll',
    historySupportMiddleware: true,
    routerScroll: {
      scrollElement: '#scrolling-result-content',
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    'labs-search': {
      host: 'https://search-api.planninglabs.nyc',
      route: 'search',
      helpers: ['geosearch'],
    },

    'mapbox-gl': {
      accessToken: '',
      map: {
        style: '//raw.githubusercontent.com/NYCPlanning/labs-gl-style/master/data/style.json',
        zoom: 12.25,
        center: [-73.9868, 40.724],
      },
    },

    gReCaptcha: {
      jsUrl: 'https://www.google.com/recaptcha/api.js?render=explicit', // default
      siteKey: '6LdWI2IUAAAAACg5LHP4ucs7Ep1UzaFsl96FHyPK',
    },

    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['development', 'production'],
        config: {
          id: 'UA-84250233-13',
          debug: environment === 'development',
          trace: environment === 'development',
          // Ensure development env hits aren't sent to GA
          sendHitTask: (environment !== 'development' && environment !== 'devlocal'),
        },
      },
    ],
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV['ember-cli-mirage'] = {
      enabled: true,
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'devlocal') {
    ENV.host = 'http://localhost:3000';

    ENV['ember-cli-mirage'] = {
      enabled: false,
    };
  }

  if (environment === 'production') {
    ENV['ember-cli-mirage'] = {
      enabled: false,
    };

    ENV.host = 'https://zap-api.planninglabs.nyc';
  }

  if (environment === 'staging') {
    ENV.host = 'https://zap-api-staging.planninglabs.nyc';
  }

  if (environment === 'devlive') {
    ENV.host = 'https://zap-api.planninglabs.nyc';

    ENV['ember-cli-mirage'] = {
      enabled: false,
    };
  }

  return ENV;
};
