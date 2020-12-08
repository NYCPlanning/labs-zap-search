import Route from '@ember/routing/route';

export default class ShowGeographyRoute extends Route {
  async model() {
    const zoningResolutions = await this.store.findAll('zoning-resolution');
    console.log('bananas', zoningResolutions);
    return zoningResolutions;
  }

  setupController(controller) {
    controller.fetchData.perform({ unloadAll: true });
  }
}
