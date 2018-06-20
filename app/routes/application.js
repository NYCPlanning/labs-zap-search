import Route from '@ember/routing/route';

export default class ApplicationRoute extends Route {
  beforeModel() {
    // load the projects view by default
    this.transitionTo('show-geography');
  }
}
