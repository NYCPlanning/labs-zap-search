'use strict';

module.exports = {
  globals: {
    server: true,
  },
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  parser: 'babel-eslint',
  plugins: [
    'ember',
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'airbnb-base',
  ],
  env: {
    browser: true,
  },
  globals: {
    $: true,
    d3: true,
  },
  rules: {
    'ember/no-jquery': 'error',
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'import/no-named-as-default': 1,
    'import/prefer-default-export': 1,
    'import/extensions': 0,
    'import/no-named-as-default-member': 1,
    'array-callback-return': 1,
    'consistent-return': 1,
    'default-case': 1,
    eqeqeq: 1,
    'lines-around-directive': 0,
    'func-names': 0,
    'space-before-function-paren': 0,
    'prefer-arrow-callback': 0,
    'prefer-rest-params': 1,
    'no-mixed-operators': 1,
    'no-shadow': 1,
    'no-restricted-globals': 1,
    'no-restricted-syntax': 1,
    'prefer-const': 1,
    'no-underscore-dangle': 0,
    'no-use-before-define': 0,
    'no-return-assign': 1,
    camelcase: 0,
    'class-methods-use-this': 0,
    'max-len': 0,
    'no-param-reassign': 0,
    'implicit-arrow-linebreak': 1,
    'no-nested-ternary': 1,
    'no-restricted-properties': 1,
    'prefer-promise-reject-errors': 1,
    'no-plusplus': 1,
    'no-return-await': 1,
    'operator-linebreak': 1,
    'ember/avoid-leaking-state-in-ember-objects': 0,
  },
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'testem.js',
        'config/**/*.js',
        'lib/*/index.js',
        'server/**/*.js',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['node'],
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        // add your custom rules and overrides for node files here

        // this can be removed once the following is fixed
        // https://github.com/mysticatea/eslint-plugin-node/issues/77
        'node/no-unpublished-require': 'off',
      }),
    },
  ],
};

