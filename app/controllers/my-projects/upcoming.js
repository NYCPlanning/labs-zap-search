import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default class MyProjectsUpcomingController extends Controller {
  @service
  currentUser;

  // sort assignments based on`project.dcp_certificationtargetdate`, ascending
  @computed('model')
  get sortedProjects() {
    const assignments = this.get('model');
    return assignments.sortBy('project.dcp_certificationtargetdate');
  }
}
