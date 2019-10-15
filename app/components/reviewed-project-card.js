import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class ReviewedProjectCardComponent extends Component {
  @service
  currentUser;

  assignment = {
    reviewedMilestoneActualStartEndDates: [],
  };

  // Assumes at most two milestones are 'In Progress'
  @computed('assignment.reviewedMilestoneActualStartEndDates')
  get timeDisplayLabel() {
    const inProgressMilestonesDates = this.assignment.reviewedMilestoneActualStartEndDates;
    if (inProgressMilestonesDates.length > 1 && inProgressMilestonesDates[0] && inProgressMilestonesDates[1]) {
      return `${inProgressMilestonesDates[0].displayName.replace(' Review', '').trim()} and ${inProgressMilestonesDates[1].displayName}`;
    }
    if (inProgressMilestonesDates[0]) {
      return inProgressMilestonesDates[0].displayName;
    }
    return '';
  }

  @computed('assignment.reviewedMilestoneActualStartEndDates')
  get timeDisplay() {
    const firstInProgressMilestoneDates = this.assignment.reviewedMilestoneActualStartEndDates[0] || {};
    if (firstInProgressMilestoneDates.displayName && firstInProgressMilestoneDates.dcpActualstartdate && firstInProgressMilestoneDates.dcpActualenddate) {
      return {
        displayName: firstInProgressMilestoneDates.displayName,
        timeRemaining: moment(firstInProgressMilestoneDates.dcpActualenddate).diff(moment(), 'days'),
        timeDuration: moment(firstInProgressMilestoneDates.dcpActualenddate).diff(moment(firstInProgressMilestoneDates.dcpActualstartdate), 'days'),
        dcpActualenddate: firstInProgressMilestoneDates.dcpActualenddate,
      };
    }
    return {
      displayName: null,
      timeRemaining: null,
      timeDuration: null,
      dcpActualenddate: null,
    };
  }
}
