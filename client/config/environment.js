'use strict';

const { MIRAGE_SCENARIO } = process.env;
const NYCID_RELYING_PARTY_CLIENT_ID = process.env.NYCID_RELYING_PARTY_CLIENT_ID || 's6BuNcPytgziT2x0ZdISAFJ5';
const NYCID_OIDC_ENDPOINT = process.env.NYCID_OIDC_ENDPOINT || 'https://nonprd-login.nyc.gov/oidc/op/v1.0/3_DkZigi2v_eW7z-cZt8PAw-cYWQYg2d8VqABUFRZUhhzxNAdwR5brLl_h8Hqbo7Bm';
const NYCID_LOGOUT_BASE_URL = process.env.NYCID_LOGOUT_BASE_URL || 'https://accounts-nonprd.nyc.gov/account';
module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'labs-zap-search',
    environment,
    rootURL: '/',
    locationType: 'router-scroll',
    historySupportMiddleware: true,
    routerScroll: {
      scrollElement: '#scrolling-result-content',
    },
    maintenanceTimes: getMaintenanceTimes(),
    featureFlagExcludeFromSearchResults: getFeatureFlagExcludeFromSearchResults(),
    featureFlagShowSandboxWarning: getFeatureFlagShowSandboxWarning(),

    host: getHost(environment),
    NYCID_OIDC_ENDPOINT,
    NYCID_LOGOUT_BASE_URL,
    OAUTH_ENDPOINT: `${NYCID_OIDC_ENDPOINT}/authorize?response_type=code&client_id=${NYCID_RELYING_PARTY_CLIENT_ID}`,
    LUPP_ENABLED: true,
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
      host: 'https://search-api-production.herokuapp.com',
      route: 'search',
      helpers: ['geosearch-v2'],
    },

    'mapbox-gl': {
      accessToken: '',
      map: {
        style: '//labs-layers-api-staging.herokuapp.com/v1/base/style.json',
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
          sendHitTask:
            environment !== 'development' && environment !== 'devlocal',
        },
      },
      {
        name: 'GoogleAnalyticsFour',
        environments: ['development', 'production'],
        config: {
          id: 'G-ZVJLNQ41N5',
          options: {
            debug_mode: environment === 'development',
          },
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
        dcp_femafloodzoneshadedx: 'FEMA Flood Zone',
        dcp_publicstatus: 'Project Status',
        dcp_ulurp_nonulurp: 'ULURP Type',
        dcp_easeis: 'CEQR',
        distance_from_point: 'Radius Filter',
        project_applicant_text: 'Text Match',
        radius_from_point: 'Radius Filter',
        'zoning-resolutions': 'Zoning Resolutions',
        dcp_applicability: 'Racial Equity Report Applicability',
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
      trackRequests: true,
    };
  }

  if (environment === 'production') {
    ENV['ember-cli-mirage'] = {
      enabled: false,
    };

    ENV['mapbox-gl'].map.style = 'https://labs-layers-api.herokuapp.com/v1/base/style.json';
  }

  if (environment !== 'production') {
    ENV.noindex = {
      enabled: true,
    };
  }

  return ENV;
};

function getHost(environment) {
  if (process.env.HOST && environment !== 'test') {
    return process.env.HOST;
  }

  if (environment === 'review') {
    return process.env.HOST_PR_REVIEW;
  }

  return '';
}

function getMaintenanceTimes() {
  const {
    MAINTENANCE_START = '01/01/01 00:00',
    MAINTENANCE_END = '01/01/01 00:00',
  } = process.env;

  return [MAINTENANCE_START, MAINTENANCE_END];
}

function getFeatureFlagExcludeFromSearchResults() {
  return process.env.FEATURE_FLAG_EXCLUDE_FROM_SEARCH_RESULTS === 'ON';
}

function getFeatureFlagShowSandboxWarning() {
  return process.env.FEATURE_FLAG_SHOW_SANDBOX_WARNING === 'ON';
}
