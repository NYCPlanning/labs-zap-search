import Component from '@ember/component';
import { computed, action } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class UpcomingProjectCardComponent extends Component {
  @service
  currentUser;

  assignment = {};

  showPopup = false;

  @computed('assignment.publicReviewPlannedStartDate')
  get isMoreThanThirtyDaysBeforePublicReview() {
    if (this.assignment.publicReviewPlannedStartDate) {
      return (moment(this.assignment.publicReviewPlannedStartDate).diff(moment(), 'days') > 30);
    }
    return null;
  }

  @action
  openOptOutHearingPopup() {
    this.set('showPopup', true);
  }
}
