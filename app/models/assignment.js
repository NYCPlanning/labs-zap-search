import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

const {
  Model, belongsTo, hasMany, attr,
} = DS;

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
    return this.get('hearingsSubmitted') || this.get('hearingsWaived');
  }

  @computed('hearingsSubmitted', 'hearingsWaived')
  get hearingsNotSubmittedNotWaived() {
    const hearingsSubmitted = this.get('hearingsSubmitted');
    const hearingsWaived = this.get('hearingsWaived');
    return !hearingsSubmitted && !hearingsWaived;
  }

  @computed('project.milestones')
  get publicReviewPlannedStartDate() {
    const { dcpPlannedstartdate } = this.project.get('milestones').find(milestone => milestone.dcpMilestone === this.milestoneConstants.COMMUNITY_BOARD_REFERRAL) || {};
    return dcpPlannedstartdate || null;
  }

  @computed('project.milestones')
  get tabSpecificMilestones() {
    return this.project.get('milestones').filter(milestone => this.milestoneConstants.milestoneListByTabLookup[this.tab].includes(milestone.dcpMilestone));
  }

  @computed('project.milestones')
  get assigneeMilestoneIdentifier() {
    return this.milestoneConstants.referralIdentifierByAcronymLookup[this.dcpLupteammemberrole];
  }

  @computed('project.milestones')
  get lastCompletedMilestone() {
    const completedMilestones = this.project.get('milestones').filterBy('statuscode', 'Completed');

    return completedMilestones[completedMilestones.length - 1] || null;
  }

  // abridged view of milestones typically used in upcoming tab
  @computed('tab', 'project.milestones')
  get abridgedMilestonesList() {
    const milestones = this.tabSpecificMilestones
      .sortBy('dcpMilestonesequence')
      .sortBy('dcpPlannedcompletiondate');
    const { assigneeMilestoneIdentifier, lastCompletedMilestone } = this;

    // return milestones as normal if no assignee milestone ID or completed milestones are found
    if (!assigneeMilestoneIdentifier || !lastCompletedMilestone) return milestones;

    const [firstMilestone] = milestones;

    // all milestones after last completed and up to and including the LUP's relevant milestone
    const lastCompletedPosition = milestones.findIndex(milestone => milestone.id === lastCompletedMilestone.id);
    const assigneeRelevantMilestonePosition = milestones.findIndex(milestone => milestone.dcpMilestone === assigneeMilestoneIdentifier);
    const remainingMilestones = milestones.slice(lastCompletedPosition + 1, assigneeRelevantMilestonePosition + 1);

    return [firstMilestone, lastCompletedMilestone, ...remainingMilestones];
  }

  // generic computed property for displaying milestones in general
  @computed('tabSpecificMilestones')
  get assigneeDisplayMilestones() {
    switch (this.tab) {
      case 'upcoming':
        return this.abridgedMilestonesList;
      default:
        return this.milestones;
    }
  }

  // This field is used to display the participant's review planned start date.
  // If not found, returns null
  @computed('tab', 'dcpLupteammemberrole', 'project.milestones')
  get upcomingMilestonePlannedStartDate() {
    const participantMilestoneId = this.milestoneConstants.referralIdentifierByAcronymLookup[this.dcpLupteammemberrole];
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
    const participantMilestoneId = this.milestoneConstants.referralIdentifierByAcronymLookup[this.dcpLupteammemberrole];
    const { dcpActualstartdate } = this.project.get('milestones').find(milestone => milestone.dcpMilestone === participantMilestoneId) || {};
    return dcpActualstartdate;
  }

  @computed('tab', 'dcpLupteammemberrole', 'project.milestones')
  get toReviewMilestonePlannedCompletionDate() {
    if (this.tab !== 'to-review') {
      return null;
    }

    const participantMilestoneId = this.milestoneConstants.referralIdentifierByAcronymLookup[this.dcpLupteammemberrole];
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
