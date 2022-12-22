import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { fsSetUserVars } from 'labs-zap-search/helpers/fs-set-user-vars';

export default class MyProjectsToReviewController extends Controller {
  @service
  currentUser;

  // sort assignments based on `toReviewMilestonePlannedCompletionDate` ascending
  @computed('model')
  get sortedProjects() {
    const assignments = this.get('model');
    fsSetUserVars({ loggedInZapSearchUserHasProjects: true });
    return assignments.sortBy('toReviewMilestonePlannedCompletionDate');
  }
}
