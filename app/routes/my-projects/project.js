import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class MyProjectsProjectRoute extends Route {
  // TODO: Only load project if it belongs to auth'd user.
  async model({ project_id }) {
    const project = await this.store.findRecord('project', project_id, {
      include: 'actions,dispositions.action',
      reload: true,
    });
    return project;
  }

  @action
  error() {
    this.transitionTo('not-found', 'not-found');
  }
}
