import DS from 'ember-data';
import { computed } from '@ember/object';
import {
  COMMUNITY_BOARD_REFERRAL as COMMUNITY_BOARD_REFERRAL_MILESTONE,
  MILESTONE_LIST_BY_TAB_LOOKUP,
  REFERRAL_MILESTONEID_BY_ACRONYM_LOOKUP,
  REVIEW_MILESTONE_IDS,
} from './milestone/constants';
import {
  DCPISPUBLICHEARINGREQUIRED_OPTIONSET,
} from './disposition/constants';

const {
  Model, belongsTo, hasMany, attr,
} = DS;

export const participantRoles = [
  { abbreviation: 'BP', label: 'Borough President' },
  { abbreviation: 'BB', label: 'Borough Board' },
  { abbreviation: 'CB', label: 'Community Board' },
];

export default class AssignmentModel extends Model {
  @belongsTo('user', { async: false }) user;

  @belongsTo('project', { async: false }) project;

  // ZAP-API will filter this to the set of lupteammember role's dispos
  // this could be computed through the project dispositions: project_dispositions
  @hasMany('disposition', { async: false }) dispositions;

  /**
   * Explicitly filter dispositions for a given assignment role.
   * The dispositions property itself does this implicitly.
   *
   * @type       {Array of Disposition models}
   */
  @computed('dispositions')
  get dispositionsByRole() {
    const { label } = participantRoles.findBy('abbreviation', this.dcpLupteammemberrole);

    return this.dispositions.filterBy('dcpRepresenting', label);
  }

  @attr('string') dcpLupteammemberrole;

  @attr('string') tab;

  // temp variable for sorting assignments by project
  // see the my projects controllers
  sortingActualEndDate;

  // if the each dcpPublichearinglocation and dcpDateofpublichearing properties are filled in dispositions array,
  // then hearings have been submitted for that project
  @computed('dispositionsByRole.@each.{dcpPublichearinglocation,dcpDateofpublichearing}')
  get hearingsSubmitted() {
    const dispositions = this.get('dispositionsByRole');
    // array of hearing locations
    const dispositionHearingLocations = dispositions.map(disp => `${disp.dcpPublichearinglocation}`);
    // array of hearing dates
    const dispositionHearingDates = dispositions.map(disp => disp.dcpDateofpublichearing);

    return dispositionHearingLocations.length > 0
    && dispositionHearingLocations.every(location => !!location)
    && dispositionHearingDates.length > 0
    && dispositionHearingDates.every(date => !!date);
  }

  // if all dcpIspublichearingrequired in dispositions array equal "No",
  // then hearings have been waived
  @computed('dispositionsByRole.@each.dcpIspublichearingrequired')
  get hearingsWaived() {
    const dispositions = this.get('dispositionsByRole');
    // array of dcpIspublichearingrequired values
    const publicHearingRequiredArray = dispositions.map(disp => disp.dcpIspublichearingrequired);
    // check that each item in array equals 'No'
    return publicHearingRequiredArray.every(req => req === DCPISPUBLICHEARINGREQUIRED_OPTIONSET.NO) && publicHearingRequiredArray.length > 0;
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
    const { dcpPlannedstartdate } = this.project.get('milestones').find(milestone => milestone.dcpMilestone === COMMUNITY_BOARD_REFERRAL_MILESTONE) || {};
    return dcpPlannedstartdate || null;
  }

  @computed('project.milestones')
  get tabSpecificMilestones() {
    return this.project.get('milestones').filter(milestone => MILESTONE_LIST_BY_TAB_LOOKUP[this.tab].includes(milestone.dcpMilestone));
  }

  // abridged view of milestones typically used in upcoming tab
  @computed('tab', 'tabSpecificMilestones', 'project.milestones')
  get abridgedMilestonesList() {
    const milestones = this.tabSpecificMilestones
      .sortBy('dcpMilestonesequence')
      .sortBy('dcpPlannedcompletiondate');

    // first milestone in the list
    const [firstMilestone] = milestones;

    // review milestones refer to four milestones: App Reviewed at CPC Review Session, CB Review, BP Review, and BB Review
    const reviewMilestones = milestones.filter(milestone => REVIEW_MILESTONE_IDS.includes(milestone.dcpMilestone));

    // the order of milestones on the upcoming tab should be:
    // (1) the first milestone in the milestone list for that project
    // (2) the "view full timeline" link
    // (3) the four milestones associated with a review
    return [firstMilestone, ...reviewMilestones];
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
    const participantMilestoneId = REFERRAL_MILESTONEID_BY_ACRONYM_LOOKUP[this.dcpLupteammemberrole];
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
    const participantMilestoneId = REFERRAL_MILESTONEID_BY_ACRONYM_LOOKUP[this.dcpLupteammemberrole];
    const { dcpActualstartdate } = this.project.get('milestones').find(milestone => milestone.dcpMilestone === participantMilestoneId) || {};
    return dcpActualstartdate;
  }

  @computed('tab', 'dcpLupteammemberrole', 'project.milestones')
  get toReviewMilestonePlannedCompletionDate() {
    if (this.tab !== 'to-review') {
      return null;
    }

    const participantMilestoneId = REFERRAL_MILESTONEID_BY_ACRONYM_LOOKUP[this.dcpLupteammemberrole];
    const { dcpPlannedcompletiondate } = this.project.get('milestones').find(milestone => milestone.dcpMilestone === participantMilestoneId) || {};
    return dcpPlannedcompletiondate;
  }

  @computed('tab', 'dcpLupteammemberrole', 'project.milestones')
  get toReviewMilestoneTimeRemaining() {
    const participantMilestoneId = REFERRAL_MILESTONEID_BY_ACRONYM_LOOKUP[this.dcpLupteammemberrole];
    const { remainingDays } = this.project.get('milestones').find(milestone => milestone.dcpMilestone === participantMilestoneId) || {};
    return remainingDays;
  }

  @computed('tab', 'dcpLupteammemberrole', 'project.milestones')
  get toReviewMilestoneTimeDuration() {
    const participantMilestoneId = REFERRAL_MILESTONEID_BY_ACRONYM_LOOKUP[this.dcpLupteammemberrole];
    const { dcpGoalduration } = this.project.get('milestones').find(milestone => milestone.dcpMilestone === participantMilestoneId) || {};
    return dcpGoalduration;
  }

  // If `tab` is 'reviewed'...
  //   - these start/end dates come from the current In Progress milestone
  //   - an array of milestone dates is returned
  @computed('tab', 'dcpLupteammemberrole', 'project.milestones')
  get reviewedMilestoneDates() {
    if (this.tab !== 'reviewed') {
      return null;
    }

    return this.project
      .get('milestones')
      .filter(milestone => milestone.statuscode === 'In Progress')
      .map(milestone => ({
        milestone: milestone.dcpMilestone,
        displayName: milestone.displayName,
        dcpActualstartdate: milestone.dcpActualstartdate,
        dcpPlannedcompletiondate: milestone.dcpPlannedcompletiondate,
        remainingDays: milestone.remainingDays,
        dcpGoalduration: milestone.dcpGoalduration,
      }));
  }
}
