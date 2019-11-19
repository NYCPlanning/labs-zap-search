'use strict';

// if this exists in the environment, use it instead of others
const ENVIRONMENTAL_HOST_API = process.env.HOST_API;
let { LUPP_ENABLED = true } = process.env;

LUPP_ENABLED = JSON.parse(LUPP_ENABLED);
const MIRAGE_SCENARIO = process.env.MIRAGE_SCENARIO;

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
    NYC_ID_HOST: 'https://accounts-nonprd.nyc.gov',
    host: ENVIRONMENTAL_HOST_API || '',
    OAUTH_ENDPOINT: 'https://accounts-nonprd.nyc.gov/account/api/oauth/authorize.htm?response_type=token&client_id=zap_staging',
    LUPP_ENABLED,
    MIRAGE_SCENARIO,
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },
    fontawesome: {
      icons: {
        // Wastefully use all icons
        'free-solid-svg-icons': 'all',
        'free-regular-svg-icons': 'all',
        'free-brands-svg-icons': 'all',

        // TODO -- Use a subset of icons
        // 'free-solid-svg-icons': [
        //   'stroopwafel'
        // ],
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
        style: '//layers-api-staging.planninglabs.nyc/v1/base/style.json',
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
          debug: environment === 'debug-ga',
          trace: environment === 'debug-ga',
          // Ensure development env hits aren't sent to GA
          sendHitTask: (environment !== 'development' && environment !== 'devlocal'),
        },
      },
    ],

    // people-friendly labels for query parameters and database
    // column names
    labels: {
      filters: {
        'action-types': 'Action Type',
        block: 'Borough / Block',
        boroughs: 'Borough / Block',
        'community-districts': 'Community District',
        dcp_certifiedreferred: 'Date Certified / Referred',
        dcp_femafloodzonea: 'FEMA Flood Zone',
        dcp_femafloodzonecoastala: 'FEMA Flood Zone',
        dcp_femafloodzoneshadedx: 'FEMA Flood Zone',
        dcp_femafloodzonev: 'FEMA Flood Zone',
        dcp_publicstatus: 'Project Stage',
        dcp_ulurp_nonulurp: 'ULURP Type',
        distance_from_point: 'Radius Filter',
        project_applicant_text: 'Text Match',
        radius_from_point: 'Radius Filter',
      },
    },
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
    ENV['mapbox-gl'].map.style = '/test-data/style.json';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;

    ENV['ember-cli-mirage'] = {
      trackRequests: true
    };
  }

  if (environment === 'production') {
    ENV['ember-cli-mirage'] = {
      enabled: false,
    };

    ENV.host = ENVIRONMENTAL_HOST_API || 'https://zap-api.planninglabs.nyc';
    ENV['mapbox-gl'].map.style = 'https://layers-api.planninglabs.nyc/v1/base/style.json';
  }

  return ENV;
};
