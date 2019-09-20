import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class ShowProjectRoute extends Route {
  async model({ id }) {
    const project = await this.store.findRecord('project', id, {
      reload: true,
      include: 'actions,milestones,dispositions',
    });
    return project;
  }

  @action
  error() {
    this.transitionTo('not-found', 'not-found');
  }
}
