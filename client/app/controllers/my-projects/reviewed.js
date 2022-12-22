import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { fsSetUserVars } from 'labs-zap-search/helpers/fs-set-user-vars';

export default class MyProjectsReviewedController extends Controller {
  @service
  currentUser;

  // sort assignments based on the user's review milestone `dcpActualenddate` descending
  @computed('model')
  get sortedAssignments() {
    const assignments = this.get('model');
    const assignmentsWithSortingProperty = [];
    fsSetUserVars({ loggedInZapSearchUserHasProjects: true });

    // create new array of assignments
    assignments.forEach(function(assignment) {
      assignmentsWithSortingProperty.push(assignment);
    });

    // set a new property on each project item called `sortingActualEndDate`
    // based on the user's `dcpLupteammemberrole`, this new property
    // will be set to the user's review milestone `dcpActualenddate`
    assignmentsWithSortingProperty.forEach(function(assignment) {
      if (assignment.dcpLupteammemberrole === 'BP') {
        const boroughPresidentReviewMilestone = assignment.project.milestones.find(m => m.displayName === 'Borough President Review') || {};
        assignment.set('sortingActualEndDate', boroughPresidentReviewMilestone.dcpActualenddate);
      } else if (assignment.dcpLupteammemberrole === 'BB') {
        const boroughBoardReviewMilestone = assignment.project.milestones.find(m => m.displayName === 'Borough Board Review') || {};
        assignment.set('sortingActualEndDate', boroughBoardReviewMilestone.dcpActualenddate);
      } else if (assignment.dcpLupteammemberrole === 'CB') {
        const communityBoardReviewMilestone = assignment.project.milestones.find(m => m.displayName === 'Community Board Review') || {};
        assignment.set('sortingActualEndDate', communityBoardReviewMilestone.dcpActualenddate);
      }
    });

    // this array of objects is then sorted by this date property and then reversed
    return assignmentsWithSortingProperty.sortBy('sortingActualEndDate').reverseObjects();
  }
}
