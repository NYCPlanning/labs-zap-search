import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import Model from '@ember-data/model';
import config from './config/environment';

const ALLOWED_MISSING_MODEL_KEYS = ['nodeType', 'size', 'length', 'setUnknownProperty', 'didCommit', 'then', 'willMergeMixin', 'concatenatedProperties', 'mergedProperties', 'isQueryParams'];

Model.reopen({
  unknownProperty(key) {
    if (ALLOWED_MISSING_MODEL_KEYS.includes(key)) return;

    throw new Error(`Unexpected access of ${key} on ${this}`);
  },
});

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,
});

loadInitializers(App, config.modulePrefix);
