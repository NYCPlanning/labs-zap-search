import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ShowProjectRoute extends Route {
  @service
  currentUser

  async model({ id }) {
    const project = await this.store.findRecord('project', id, {
      reload: true,
      include: 'actions,milestones,dispositions,dispositions.action,users,assignments.user,packages,artifacts',
    });
    return project;
  }

  async setupController(controller, model) {
    super.setupController(controller, model);
    const userFromCurrentUser = await this.currentUser.get('user');
    const currentTabs = model.assignments.getEach('tab');

    controller.set('user', userFromCurrentUser);
    controller.set('currentProjectTab', currentTabs);
  }

  @action
  error(e) {
    console.log(e); // eslint-disable-line
    this.transitionTo('not-found', 'not-found');
  }
}
