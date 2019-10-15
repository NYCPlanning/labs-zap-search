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

  @computed('project.milestones')
  get publicReviewPlannedStartDate() {
    const { dcpPlannedstartdate } = this.project.get('milestones').find(milestone => milestone.dcpMilestone === COMMUNITY_BOARD_REFERRAL_MILESTONE_ID) || {};
    return dcpPlannedstartdate || null;
  }

  @computed('project.milestones')
  get tabSpecificMilestones() {
    return this.project.get('milestones').filter(milestone => this.milestoneConstants.milestoneListByTabLookup[this.tab].includes(milestone.dcpMilestone));
  }

  // The following <tab>MilestoneActual<Start/End>
  // date fields represent different dates from different milestones
  // depending on `tab`:

  // If `tab` is `upcoming`...
  // if the project is in public review, this field is used to display the participant's review planned start date.
  // else this field returns null
  @computed('tab', 'dcpLupteammemberrole', 'project.{milestones,dcpPublicstatus}')
  get upcomingMilestonePlannedStartDate() {
    if (this.tab === 'upcoming') {
      if (this.project.dcpPublicstatus !== 'Filed') {
        const participantMilestoneId = MILESTONE_ID_LOOKUP[this.dcpLupteammemberrole];
        const participantReviewMilestone = this.project.get('milestones').find(milestone => milestone.dcpMilestone === participantMilestoneId);
        return participantReviewMilestone ? participantReviewMilestone.dcpPlannedstartdate : null;
      }
    }
    return null;
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
  get toReviewMilestoneActualEndDate() {
    if (this.tab !== 'to-review') {
      return null;
    }
    const participantMilestoneId = MILESTONE_ID_LOOKUP[this.dcpLupteammemberrole];
    const { dcpActualenddate } = this.project.get('milestones').find(milestone => milestone.dcpMilestone === participantMilestoneId) || {};
    return dcpActualenddate;
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
      dcpActualenddate: milestone.dcpActualenddate,
      dcpPlannedcompletiondate: milestone.dcpPlannedcompletiondate,
    }));
  }
}
