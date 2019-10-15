import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MyProjectsProjectHearingAddRoute extends Route {
  // Depends on the my-project/project route already loading a project
  // with side-loaded actions

  @service
  store;

  @service
  currentUser;

  async model() {
    return this.modelFor('my-projects.assignment');
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set('hearingSubmitted', false);
      controller.set('checkIfMissing', false);
      controller.set('allActions', null);
    }
  }

  @action
  error(error) {
    console.log(error);

    this.transitionTo('not-found', 'not-found');
  }
}
