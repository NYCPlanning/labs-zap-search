import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MyProjectsUpcomingRoute extends Route {
  @service
  currentUser;

  @service
  store;

  async model() {
    return this.store.query('assignment', {
      tab: 'upcoming',
      include: 'project.milestones,project.dispositions,project.actions',
    }, {
      reload: true,
    });
  }
}
