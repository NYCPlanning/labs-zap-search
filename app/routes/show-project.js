import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ShowProjectRoute extends Route {
  @service
  currentUser

  async model({ id }) {
    const project = await this.store.findRecord('project', id, {
      reload: true,
      include: 'actions,milestones,dispositions,users',
    });
    return project;
  }

  async setupController(controller, model) {
    super.setupController(controller, model);
    const userFromCurrentUser = await this.currentUser.get('user');
    controller.set('user', userFromCurrentUser);
  }

  @action
  error() {
    this.transitionTo('not-found', 'not-found');
  }
}
