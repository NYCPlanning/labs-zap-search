import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default class MyProjectsReviewedController extends Controller {
  @service
  currentUser;

  // sort projects by `dcpProjectCompleted` descending
  @computed('model')
  get sortedProjects() {
    const projects = this.get('model');
    return projects.sortBy('dcpProjectcompleted').reverseObjects();
  }
}
