import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default class MyProjectsArchiveRoute extends Route {
  @service
  currentUser;

  @service
  store;

  async model(model, transition) {
    const email = get(transition, 'to.queryParams.email');

    // Use this endpoint for now. This will need to be updated when the backend is finalized.
    return this.store.query('assignment', {
      tab: 'archive',
      ...(email ? { email } : {}),
      include: 'project.milestones,project.dispositions,project.actions,project.dispositions.action,dispositions,dispositions.action',
    }, {
      reload: true,
    });
  }
}
