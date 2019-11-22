import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class MyProjectsAssignmentRoute extends Route {
  async model({ assignment_id }) {
    return this.store.findRecord('assignment', assignment_id, {
      include: 'dispositions,project,project.dispositions,project.dispositions.action,project.actions',
      reload: true,
    });
  }

  @action
  error(error) {
    console.log(error);
  }
}
