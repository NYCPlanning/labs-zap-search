import Route from '@ember/routing/route';

export default class MyProjectsToReviewRoute extends Route {
  async model() {
    return this.store.findAll('project');
  }
}
