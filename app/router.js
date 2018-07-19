import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';

const Router = EmberRouter.extend({
  metrics: service(),
  didTransition(...args) {
    this._super(...args);
    this._trackPage();
  },

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.url;
      const title = this.getWithDefault('currentRouteName', 'unknown');
      this.metrics.trackPage({ page, title });
    });
  },

  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('show-project', { path: '/projects/:id' });
  this.route('show-geography', { path: '/projects' });
  this.route('disclaimer');
  this.route('not-found', { path: '/*path' });
  this.route('oops');
});

export default Router;
