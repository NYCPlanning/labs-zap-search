import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class ShowProjectRoute extends Route {
  model({ id }) {
    return this.store.findRecord('crm-project', id, { reload: true });
  }

  @action
  error() {
    this.transitionTo('not-found', 'not-found');
  }
}
