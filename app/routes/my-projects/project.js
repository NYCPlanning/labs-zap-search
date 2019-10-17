import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class MyProjectsProjectRoute extends Route {
  // TODO: Only load project if it belongs to auth'd user.
  afterModel(model) {
    this.transitionTo('show-project', model);
  }

  @action
  error() {
    this.transitionTo('not-found', 'not-found');
  }
}
