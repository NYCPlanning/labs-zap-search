import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

// This route must receive an Assignment model from the origin route.
// e.g. pass an Assignment model in the LinkTo helper.
export default class MyProjectsProjectRecommendationsAddRoute extends Route {
  @service
  store;

  @service
  currentUser;

  async setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('dispositions', model.dispositionsByRole);
    controller.set('allActions', model.dispositionsByRole.length <= 1 ? true : null);
  }

  @action
  error(e) {
    console.log(e); // eslint-disable-line
    this.transitionTo('not-found', 'not-found');
  }
}
