import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { fsSetUserVars } from 'labs-zap-search/helpers/fs-set-user-vars';

export default class MyProjectsReviewedController extends Controller {
  @service
  currentUser;

  // sort projects by `dcpProjectCompleted` descending
  @computed('model')
  get sortedAssignments() {
    fsSetUserVars({ loggedInZapSearchUserHasProjects: true });
    return this.model.sortBy('project.dcpProjectcompleted').reverseObjects();
  }
}
