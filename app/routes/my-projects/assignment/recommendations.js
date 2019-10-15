import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class ShowProjectRoute extends Route {
  @action
  error() {
    this.transitionTo('not-found', 'not-found');
  }
}
