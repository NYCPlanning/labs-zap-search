import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default class MyProjectsReviewedController extends Controller {
  @service
  currentUser;

  // sort projects by `dcpProjectCompleted` descending
  @computed('model')
  get sortedAssignments() {
    return this.model.sortBy('project.dcpProjectcompleted').reverseObjects();
  }
}
