import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default class MyProjectsReviewedController extends Controller {
  @service
  currentUser;

  // sort projects based on the user's review milestone `dcpActualenddate` descending
  @computed('model')
  get sortedProjects() {
    const projects = this.get('model');
    const projectsWithSortingProperty = [];

    // create new array of projects
    projects.forEach(function(project) {
      projectsWithSortingProperty.push(project);
    });

    // set a new property on each project item called `sortingActualEndDate`
    // based on the user's `dcpLupteammemberrole`, this new property
    // will be set to the user's review milestone `dcpActualenddate`
    projectsWithSortingProperty.forEach(function(project) {
      if (project.dcpLupteammemberrole === 'BP') {
        const boroughPresidentReviewMilestone = project.milestones.find(m => m.displayName === 'Borough President Review');
        project.set('sortingActualEndDate', boroughPresidentReviewMilestone.dcpActualenddate);
      } else if (project.dcpLupteammemberrole === 'BB') {
        const boroughBoardReviewMilestone = project.milestones.find(m => m.displayName === 'Borough Board Review');
        project.set('sortingActualEndDate', boroughBoardReviewMilestone.dcpActualenddate);
      } else if (project.dcpLupteammemberrole === 'CB') {
        const communityBoardReviewMilestone = project.milestones.find(m => m.displayName === 'Community Board Review');
        project.set('sortingActualEndDate', communityBoardReviewMilestone.dcpActualenddate);
      }
    });

    // this array of objects is then sorted by this date property and then reversed
    return projectsWithSortingProperty.sortBy('sortingActualEndDate').reverseObjects();
  }
}
