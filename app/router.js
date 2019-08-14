import EmberRouter from '@ember/routing/router';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import RouterScroll from 'ember-router-scroll';

import config from './config/environment';

const Router = EmberRouter.extend(RouterScroll, {
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
  rootURL: config.rootURL,
});

Router.map(function() { // eslint-disable-line
  this.route('show-project', { path: '/projects/:id' });
  this.route('show-geography', { path: '/projects' });
  this.route('disclaimer');
  this.route('not-found', { path: '/*path' });
  this.route('oops');
  this.route('my-projects', function() {
    this.route('to-review');
    this.route('archive');
    this.route('upcoming');
    this.route('reviewed');

    this.route('project', { path: ':project_id' },
      function() {
        this.route('hearing', function() {
          this.route('add');
        });
      });
  });
  this.route('login');
});

export default Router;
