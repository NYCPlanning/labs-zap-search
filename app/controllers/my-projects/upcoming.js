import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default class MyProjectsUpcomingController extends Controller {
  @service
  currentUser;

  // sort projects based on `publicReviewPlannedStartDate` ascending
  @computed('model')
  get sortedProjects() {
    const projects = this.get('model');
    return projects.sortBy('publicReviewPlannedStartDate');
  }
}
