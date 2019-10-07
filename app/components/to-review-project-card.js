import Component from '@ember/component';
import { computed, action } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class ToReviewProjectCardComponent extends Component {
  @service
  currentUser;

  showPopup = false;

  project = {};

  @computed('project.toReviewMilestoneActualEndDate')
  get timeRemaining() {
    return moment(this.project.toReviewMilestoneActualEndDate).diff(moment().endOf('day'), 'days');
  }

  @computed('project.{toReviewMilestoneActualStartDate,toReviewMilestoneActualEndDate}')
  get timeDuration() {
    return moment(this.project.toReviewMilestoneActualEndDate).diff(moment(this.project.toReviewMilestoneActualStartDate), 'days');
  }

  // if the each dcpPublichearinglocation and dcpDateofpublichearing properties are filled in dispositions array,
  // then hearings have been submitted for that project
  @computed('project.dispositions.@each.{dcpPublichearinglocation,dcpDateofpublichearing}')
  get hearingsSubmitted() {
    const dispositions = this.get('project.dispositions');
    // array of hearing locations
    const dispositionHearingLocations = dispositions.map(disp => `${disp.dcpPublichearinglocation}`);
    // array of hearing dates
    const dispositionHearingDates = dispositions.map(disp => disp.dcpDateofpublichearing);
    // hearingsSubmittedForProject checks whether each item in array is truthy
    const hearingsSubmittedForProject = dispositionHearingLocations.every(location => !!location) && dispositionHearingDates.every(date => !!date);
    return hearingsSubmittedForProject;
  }

  // if all dcpPublichearinglocation in dispositions array equal "waived",
  // then hearings have been waived
  @computed('project.dispositions.@each.dcpPublichearinglocation')
  get hearingsWaived() {
    const dispositions = this.get('project.dispositions');
    // array of hearing locations
    const dispositionHearingLocations = dispositions.map(disp => `${disp.dcpPublichearinglocation}`);
    // each location field equal to 'waived'
    const hearingsWaived = dispositionHearingLocations.every(location => location === 'waived');
    return hearingsWaived;
  }

  @computed('hearingsSubmitted', 'hearingsWaived')
  get hearingsSubmittedOrWaived() {
    const hearingsSubmitted = this.get('hearingsSubmitted');
    const hearingsWaived = this.get('hearingsWaived');
    return !!hearingsSubmitted || !!hearingsWaived;
  }

  @computed('hearingsSubmitted', 'hearingsWaived')
  get hearingsNotSubmittedNotWaived() {
    const hearingsSubmitted = this.get('hearingsSubmitted');
    const hearingsWaived = this.get('hearingsWaived');
    return !hearingsSubmitted && !hearingsWaived;
  }

  @action
  openOptOutHearingPopup() {
    this.set('showPopup', true);
  }
}
