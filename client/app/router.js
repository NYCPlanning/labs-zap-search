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
    scheduleOnce('afterRender', this, scheduler);
  },

  location: config.locationType,
  rootURL: config.rootURL,
});

function scheduler () {
  const page = this.url;
  const title = (this.currentRouteName === undefined ? 'unknown' : this.currentRouteName);
  this.metrics.trackPage({ page, title });
}

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
    this.route('assignment', {
      path: ':assignment_id',
    }, function() {
      this.route('hearing', function() {
        this.route('add');
        this.route('done');
      });
      this.route('recommendations', function() {
        this.route('add');
        this.route('view');
        this.route('done');
      });
    });
  });
  this.route('login');
  this.route('logout');
});
