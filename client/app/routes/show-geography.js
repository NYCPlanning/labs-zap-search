import Route from '@ember/routing/route';
import ENV from 'labs-zap-search/config/environment';

export default class ShowGeographyRoute extends Route {
  async model() {
    return this.store.findAll('zoning-resolution');
  }

  async setupController(controller, model) {
    super.setupController(controller, model);
    controller.fetchData.perform({ unloadAll: true });
    controller.set('ENV', ENV);
  }
}
