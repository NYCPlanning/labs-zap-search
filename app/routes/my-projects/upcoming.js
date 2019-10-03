import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MyProjectsUpcomingRoute extends Route {
  @service
  currentUser;

  @service
  store;

  async model() {
    const upcomingProjects = await this.store.query('project', { project_lup_status: 'upcoming', include: 'actions,milestones,dispositions.action' }, {
      reload: true,
    });
    return upcomingProjects;
  }
}
