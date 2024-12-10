'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

const environment = EmberApp.env();
const IS_PROD = environment === 'production';
const IS_TEST = environment === 'test';

module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    'ember-cli-babel': {
      includePolyfill: IS_PROD,
    },
    'ember-math-helpers': {
      only: ['add'],
    },
    'ember-cli-tooltipster': {
      importTooltipsterDefaultStyles: false,
    },
    'ember-composable-helpers': {
      only: ['take', 'drop', 'sort-by'],
    },
    hinting: IS_TEST, // Disable linting for all builds but test
    // tests: IS_TEST, // Don't even generate test files unless a test build

    sourcemaps: {
      enabled: IS_PROD, // CMD ALT F in chrome is *almost* as fast as CMD P
    },

    postcssOptions: {
      compile: {
        extension: 'scss',
        enabled: true,
        parser: require('postcss-scss'), // eslint-disable-line
        plugins: [
          {
            module: require('@csstools/postcss-sass'), // eslint-disable-line
            options: {
              includePaths: [
                'node_modules/foundation-sites/scss',
                'node_modules/nyc-planning-style-guide/dist/assets/scss',
              ],
            },
          },
        ],
      },
    },
  });
  // Use `app.import` to add additional libraries to the generated
  // output files.
  if (app.env === 'test') {
    app.import('node_modules/foundation-sites/dist/js/foundation.js', {type: "test"});
  } else {
    app.import('node_modules/foundation-sites/dist/js/foundation.min.js', {type: "vendor"});
  }
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
