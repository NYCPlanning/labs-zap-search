import Application from '@ember/application';
import loadInitializers from 'ember-load-initializers';
import DS from 'ember-data';
import Resolver from 'ember-resolver';
import config from './config/environment';

const { Model } = DS;
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

export default App;
