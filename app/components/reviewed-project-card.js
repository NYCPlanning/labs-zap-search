import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ReviewedProjectCardComponent extends Component {
  @service
  currentUser;

  assignment = {
    reviewedMilestoneDates: [],
  };

  // Assumes at most two milestones are 'In Progress'
  @computed('assignment.reviewedMilestoneDates')
  get timeDisplayLabel() {
    const inProgressMilestonesDates = this.assignment.reviewedMilestoneDates;
    if (inProgressMilestonesDates.length > 1 && inProgressMilestonesDates[0] && inProgressMilestonesDates[1]) {
      return `${inProgressMilestonesDates[0].displayName.replace(' Review', '').trim()} and ${inProgressMilestonesDates[1].displayName}`;
    }
    if (inProgressMilestonesDates[0]) {
      return inProgressMilestonesDates[0].displayName;
    }
    return '';
  }

  @computed('assignment.reviewedMilestoneDates')
  // used when dcpActualenddate doesn't exist but dcpPlannedcompletiondate does
  get plannedTimeDisplay() {
    const firstInProgressMilestoneDates = this.assignment.reviewedMilestoneDates[0] || {};
    if (firstInProgressMilestoneDates.displayName && firstInProgressMilestoneDates.dcpActualstartdate && firstInProgressMilestoneDates.dcpPlannedcompletiondate) {
      return {
        displayName: firstInProgressMilestoneDates.displayName,
        estTimeRemaining: firstInProgressMilestoneDates.dcpRemainingplanneddays,
        estTimeDuration: firstInProgressMilestoneDates.dcpGoalduration,
        dcpPlannedcompletiondate: firstInProgressMilestoneDates.dcpPlannedcompletiondate,
      };
    }
    return {
      displayName: null,
      estTimeRemaining: null,
      estTimeDuration: null,
      dcpPlannedcompletiondate: null,
    };
  }
}
