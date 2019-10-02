import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MyProjectsToReviewRoute extends Route {
  @service
  currentUser;

  @service
  store;

  async model() {
    return this.store.query('project', { project_lup_status: 'to-review', include: 'actions,milestones,dispositions.action' }, {
      reload: true,
    });
  }
}
