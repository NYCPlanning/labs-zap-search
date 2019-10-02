import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { hearingsSubmitted } from 'labs-zap-search/helpers/hearings-submitted';
import moment from 'moment';

export default class ToReviewProjectCardComponent extends Component {
  @service
  currentUser;

  project = {};

  @computed('project.toReviewMilestoneActualEndDate')
  get timeRemaining() {
    return moment(this.project.toReviewMilestoneActualEndDate).diff(moment().endOf('day'), 'days');
  }

  @computed('project.{toReviewMilestoneActualStartDate,toReviewMilestoneActualEndDate}')
  get timeDuration() {
    return moment(this.project.toReviewMilestoneActualEndDate).diff(moment(this.project.toReviewMilestoneActualStartDate), 'days');
  }

  // hearingsSubmitted is a helper that iterates through each disposition
  // and checks whether disposition has publichearinglocation and dateofpublichearing
  @computed('project')
  get hearingsSubmittedForProject() {
    const dispositions = this.get('project.dispositions');
    return hearingsSubmitted(dispositions);
  }
}
