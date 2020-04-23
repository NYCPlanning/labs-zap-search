import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default class MyProjectsToReviewRoute extends Route {
  @service
  currentUser;

  @service
  store;

  async model(model, transition) {
    const email = get(transition, 'to.queryParams.email');

    return this.store.query('assignment', {
      tab: 'to-review',
      ...(email ? { email } : {}),
      include: 'project.milestones,project.dispositions,project.actions,dispositions,dispositions.action',
    }, {
      reload: true,
    });
  }
}
