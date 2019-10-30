import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class MyProjectsAssignmentHearingDoneRoute extends Route {
  async model() {
    return this.modelFor('my-projects.assignment');
  }

  @action
  error(e) {
    console.log(e); // eslint-disable-line
    this.transitionTo('not-found', 'not-found');
  }
}
