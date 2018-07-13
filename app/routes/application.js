import Route from '@ember/routing/route';

export default class ApplicationRoute extends Route {
  beforeModel(transition) {
    // load the projects view by default
    if (transition.intent.url === '/') {
      this.transitionTo('projects');
    }
  }
}
