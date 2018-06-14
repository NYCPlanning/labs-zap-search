import Route from '@ember/routing/route';

export default class ShowGeographyRoute extends Route {
  model({ id }) {
    return this.store.findRecord('geography', id, { include: 'projects' });
  }
}
