import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MyProjectsProjectRecommendationsAddRoute extends Route {
  // Depends on the my-project/project route already loading a project
  // with side-loaded actions

  @service
  store;

  @service
  currentUser;

  model() {
    return this.modelFor('my-projects.project');
  }

  async setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('dispositions', model.dispositions);
  }

  @action
  error() {
    this.transitionTo('not-found', 'not-found');
  }
}
