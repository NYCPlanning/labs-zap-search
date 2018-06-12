import Route from '@ember/routing/route';

export default class RouteClass extends Route {
  model() {
    return this.store.findAll('project');
  }
}
