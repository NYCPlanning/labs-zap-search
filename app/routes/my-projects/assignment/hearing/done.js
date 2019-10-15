import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class MyProjectsProjectHearingDoneRoute extends Route {
  async model() {
    return this.modelFor('my-projects.project');
  }

  @action
  error() {
    this.transitionTo('not-found', 'not-found');
  }
}
