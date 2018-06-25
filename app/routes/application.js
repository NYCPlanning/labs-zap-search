import Route from '@ember/routing/route';
import { action } from '@ember-decorators/object';

export default class ApplicationRoute extends Route {
  beforeModel(transition) {
    // load the projects view by default
    if (transition.intent.url === '/') {
      this.transitionTo('show-geography');
    }
  }

  @action
  refreshModel() {
    this.refresh();
  }
}
