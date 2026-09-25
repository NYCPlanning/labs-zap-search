import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import ENV from 'labs-zap-search/config/environment';

export default class ApplicationRoute extends Route {
  @service router;

  @service metrics;

  init(...args) {
    super.init(...args);
    this.router.on('routeDidChange', () => this._trackPage());
  }

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

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.router.currentURL;
      const title = this.router.currentRouteName || 'unknown';
      this.metrics.trackPage({ page, title });
    });
  }
}
