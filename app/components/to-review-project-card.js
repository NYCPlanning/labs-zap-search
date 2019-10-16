import Component from '@ember/component';
import { computed, action } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class ToReviewProjectCardComponent extends Component {
  @service
  currentUser;

  showPopup = false;

  assignment = {};

  @computed('assignment.toReviewMilestoneActualEndDate')
  get timeRemaining() {
    return moment(this.assignment.get('toReviewMilestoneActualEndDate')).diff(moment().endOf('day'), 'days');
  }

  @computed('assignment.{toReviewMilestoneActualStartDate,toReviewMilestoneActualEndDate}')
  get timeDuration() {
    return moment(this.assignment.get('toReviewMilestoneActualEndDate')).diff(moment(this.assignment.get('toReviewMilestoneActualStartDate')), 'days');
  }

  @action
  openOptOutHearingPopup() {
    this.set('showPopup', true);
  }
}
