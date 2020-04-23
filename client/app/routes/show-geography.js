import Route from '@ember/routing/route';

export default class ShowGeographyRoute extends Route {
  setupController(controller) {
    controller.fetchData.perform({ unloadAll: true });
  }
}
