import Component from '@ember/component';
import { computed, action } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class ToReviewProjectCardComponent extends Component {
  @service
  currentUser;

  showPopup = false;

  assignment = {};

  @computed('assignment.toReviewMilestonePlannedCompletionDate')
  get timeRemaining() {
    return moment(this.assignment.toReviewMilestonePlannedCompletionDate).diff(moment(), 'days');
  }

  @computed('assignment.{toReviewMilestoneActualStartDate,toReviewMilestonePlannedCompletionDate}')
  get timeDuration() {
    return moment(this.assignment.toReviewMilestonePlannedCompletionDate).diff(moment(this.assignment.toReviewMilestoneActualStartDate), 'days');
  }

  @action
  openOptOutHearingPopup() {
    this.set('showPopup', true);
  }
}
