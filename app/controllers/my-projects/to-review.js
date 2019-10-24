import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default class MyProjectsToReviewController extends Controller {
  @service
  currentUser;

  // sort assignments based on `toReviewMilestonePlannedCompletionDate` ascending
  @computed('model')
  get sortedProjects() {
    const assignments = this.get('model');
    return assignments.sortBy('toReviewMilestonePlannedCompletionDate');
  }
}
