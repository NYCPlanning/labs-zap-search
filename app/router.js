import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('show-project', { path: '/projects/:id' });
  this.route('show-geography', { path: '/projects' });
});

export default Router;
