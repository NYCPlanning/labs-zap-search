import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

const {
  Model, belongsTo, hasMany, attr,
} = DS;

const COMMUNITY_BOARD_REFERRAL_MILESTONE_ID = '923beec4-dad0-e711-8116-1458d04e2fb8';
const BOROUGH_PRESIDENT_REFERRAL_MILESTONE_ID = '943beec4-dad0-e711-8116-1458d04e2fb8';
const BOROUGH_BOARD_REFERRAL_MILESTONE_ID = '963beec4-dad0-e711-8116-1458d04e2fb8';
const MILESTONE_ID_LOOKUP = {
  CB: COMMUNITY_BOARD_REFERRAL_MILESTONE_ID,
  BP: BOROUGH_PRESIDENT_REFERRAL_MILESTONE_ID,
  BB: BOROUGH_BOARD_REFERRAL_MILESTONE_ID,
};

export default class AssignmentModel extends Model {
  @service
  milestoneConstants;

  @belongsTo('project', { async: false }) project;

  @belongsTo('user', { async: false }) user;

  // ZAP-API will filter this to the set of lupteammember role's dispos
  @hasMany('disposition', { async: false }) dispositions;

  @attr('string') dcpLupteammemberrole;

  @attr('string') tab;

  // temp variable for sorting assignments by project
  // see the my projects controllers
  sortingActualEndDate;

  // if the each dcpPublichearinglocation and dcpDateofpublichearing properties are filled in dispositions array,
  // then hearings have been submitted for that project
  @computed('dispositions.@each.{dcpPublichearinglocation,dcpDateofpublichearing}')
  get hearingsSubmitted() {
    const dispositions = this.get('dispositions');
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
  @computed('dispositions.@each.dcpPublichearinglocation')
  get hearingsWaived() {
    const dispositions = this.get('dispositions');

    // array of hearing locations
    const dispositionHearingLocations = dispositions.map(disp => disp.dcpPublichearinglocation);
    // each location field equal to 'waived'

    return dispositionHearingLocations.every(location => location === 'waived');
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

  @computed('project.milestones')
  get publicReviewPlannedStartDate() {
    const { dcpPlannedstartdate } = this.project.get('milestones').find(milestone => milestone.dcpMilestone === COMMUNITY_BOARD_REFERRAL_MILESTONE_ID) || {};
    return dcpPlannedstartdate || null;
  }

  @computed('project.milestones')
  get tabSpecificMilestones() {
    return this.project.get('milestones').filter(milestone => this.milestoneConstants.milestoneListByTabLookup[this.tab].includes(milestone.dcpMilestone));
  }

  // This field is used to display the participant's review planned start date.
  // If not found, returns null
  @computed('tab', 'dcpLupteammemberrole', 'project.milestones')
  get upcomingMilestonePlannedStartDate() {
    const participantMilestoneId = MILESTONE_ID_LOOKUP[this.dcpLupteammemberrole];
    const participantReviewMilestone = this.project.get('milestones').find(milestone => milestone.dcpMilestone === participantMilestoneId);
    return participantReviewMilestone ? participantReviewMilestone.dcpPlannedstartdate : null;
  }

  // If `tab` is to-review', these start/end dates are derived from
  // the participant's (specified by `dcpLupteammemberrole`) review milestone.
  @computed('tab', 'dcpLupteammemberrole', 'project.milestones')
  get toReviewMilestoneActualStartDate() {
    if (this.tab !== 'to-review') {
      return null;
    }
    const participantMilestoneId = MILESTONE_ID_LOOKUP[this.dcpLupteammemberrole];
    const { dcpActualstartdate } = this.project.get('milestones').find(milestone => milestone.dcpMilestone === participantMilestoneId) || {};
    return dcpActualstartdate;
  }

  @computed('tab', 'dcpLupteammemberrole', 'project.milestones')
  get toReviewMilestonePlannedCompletionDate() {
    if (this.tab !== 'to-review') {
      return null;
    }
    const participantMilestoneId = MILESTONE_ID_LOOKUP[this.dcpLupteammemberrole];
    const { dcpPlannedcompletiondate } = this.project.get('milestones').find(milestone => milestone.dcpMilestone === participantMilestoneId) || {};
    return dcpPlannedcompletiondate;
  }

  // If `tab` is 'reviewed'...
  //   - these start/end dates come from the current In Progress milestone
  //   - an array of milestone dates is returned
  @computed('tab', 'dcpLupteammemberrole', 'project.milestones')
  get reviewedMilestoneDates() {
    if (this.tab !== 'reviewed') {
      return null;
    }
    const inProgressMilestones = this.project.get('milestones').filter(milestone => milestone.statuscode === 'In Progress');
    return inProgressMilestones.map(milestone => ({
      milestone: milestone.dcpMilestone,
      displayName: milestone.displayName,
      dcpActualstartdate: milestone.dcpActualstartdate,
      dcpPlannedcompletiondate: milestone.dcpPlannedcompletiondate,
    }));
  }
}
