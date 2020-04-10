import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class MyProjectsAssignmentRecommendationsDoneRoute extends Route {
  @action
  error(e) {
    console.log(e); // eslint-disable-line
    this.transitionTo('not-found', 'not-found');
  }
}
