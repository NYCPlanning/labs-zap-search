import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MyProjectsToReviewRoute extends Route {
  @service
  currentUser;

  @service
  store;

  async model() {
    return this.store.findAll('assignment', {
      include: 'dispositions,project',
    }, {
      reload: true,
    });
  }
}
