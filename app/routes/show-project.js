import Route from '@ember/routing/route';

export default class ShowProjectRoute extends Route {
  model({ id }) {
    return this.store.findRecord('project', id);
  }
}
