import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MyProjectsToReviewRoute extends Route {
  @service
  currentUser;

  @service
  store;

  async model() {
    return this.store.query('assignment', {
      tab: 'to-review',
      include: 'project.milestones,project.dispositions,project.actions',
    }, {
      reload: true,
    });
  }
}
