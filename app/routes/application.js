import Route from '@ember/routing/route';
import ENV from 'labs-zap-search/config/environment';

export default class ApplicationRoute extends Route {
  beforeModel(transition) {
    // load the projects view by default
    if (transition.intent.url === '/') {
      this.transitionTo('show-geography');
    }
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('ENV', ENV);
  }
}
