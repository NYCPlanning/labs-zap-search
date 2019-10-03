import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MyProjectsReviewedRoute extends Route {
  @service
  currentUser;

  @service
  store;

  async model() {
    const reviewedProjects = await this.store.query('project', { project_lup_status: 'reviewed', include: 'actions,milestones,dispositions.action' }, {
      reload: true,
    });

    return reviewedProjects;
  }
}
