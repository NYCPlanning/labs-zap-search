import DS from 'ember-data';
import { computed } from '@ember/object';
import {
  BOROUGH_BOARD_REFERRAL,
  BOROUGH_PRESIDENT_REFERRAL,
  CEQR_FEE_PAYMENT,
  CITY_COUNCIL_REVIEW,
  COMMUNITY_BOARD_REFERRAL,
  CPC_PUBLIC_MEETING_PUBLIC_HEARING,
  CPC_PUBLIC_MEETING_VOTE,
  CPC_REVIEW_OF_COUNCIL_MODIFICATION,
  DEIS_PUBLIC_HEARING_HELD,
  DEIS_SCOPE_OF_WORK_RELEASED,
  EIS_DRAFT_SCOPE_REVIEW,
  EIS_PUBLIC_SCOPING_MEETING,
  FEIS_SUBMITTED_AND_REVIEW,
  FILED_EAS_REVIEW,
  FINAL_LETTER_SENT,
  FINAL_SCOPE_OF_WORK_ISSUED,
  LAND_USE_FEE_PAYMENT,
  MAYORAL_VOTE,
  NOC_OF_DRAFT_EIS_ISSUED,
  PREPARE_FILED_LAND_USE_APPLICATION,
  REVIEW_SESSION_CERTIFIED_REFERRED,
  REVIEW_SESSION_POST_HEARING_FOLLOW_UP_FUTURE_VOTES,
  REVIEW_SESSION_PRE_HEARING_REVIEW_POST_REFERRAL,
  SCOPING_MEETING,
} from './milestone/constants';
import {
  DCPPUBLICSTATUS_OPTIONSET,
} from './project/constants';

const {
  Model, attr, belongsTo,
} = DS;

const getTimeDiffText = function (diffMillis) {
  let sign = 1;

  if (diffMillis < 0) {
    diffMillis = Math.abs(diffMillis);
    sign = -1;
  }

  const diffMins = diffMillis / 1000 / 60;
  const d = Math.floor(diffMins / 1440);
  return (sign < 0 ? '-' : '') + d;
};

// --> <CRM/ZAP-API>:<field> indicates which CRM or ZAP-API field the Model attribute maps to.
export default class MilestoneModel extends Model {
  @belongsTo('project') project;

  // --> ZAP-API:zap_id
  // This is the Milestone ID that identifies a specific milestone
  @attr('string') dcpMilestone;

  // --> CRM:dcp_name. e.g. 'ZC - Land Use Fee Payment '
  @attr('string') dcpName;

  // --> CRM:milestonename | e.g. 'Land Use Fee Payment'
  @attr('string') milestonename;

  // --> CRM:dcp_plannedstartdate | e.g. '2018-10-31T01:21:46'
  @attr('string') dcpPlannedstartdate;

  // --> CRM:dcp_plannedcompletiondate | e.g. '2018-11-02T01:21:46'
  @attr('date') dcpPlannedcompletiondate;

  // --> CRM:dcp_actualstartdate | e.g. '2018-05-11T04:00:00'
  @attr('string') dcpActualstartdate;

  // --> CRM:dcp_actualenddate | e.g. '2018-05-12T04:00:00'
  @attr('string') dcpActualenddate;

  @attr('string') dcpReviewmeetingdate;

  // --> CRM:statuscode | e.g. 'Not Started', 'In Progress', 'Completed', 'Overridden'
  @attr('string') statuscode;

  // --> CRM:dcp_milestonesequence | e.g. 28
  @attr('string') dcpMilestonesequence;

  // --> ZAP-API:displayDescription | e.g. 'Land Use Fee Payment'
  @attr('string') displayDescription;

  // --> CRM:display_name | e.g. 'Land Use Fee Payment'
  @attr('string') displayName;

  // field `dcp_remainingplanneddayscalculated` from table dcp_projectmilestone
  // represents number of days e.g. `8`
  @attr('string') dcpRemainingplanneddays;

  // field `dcp_goalduration` from table dcp_projectmilestone
  // represents number of days e.g. `29`
  @attr('string') dcpGoalduration;

  // --> CRM:dcp_milestoneoutcome.dcp_name
  @attr('string') outcome;

  // --> ZAP-API:milestoneLinks
  @attr() milestoneLinks;

  // In list of milestones with same displayName,
  // each milestone AFTER the first will have `Revised` before the name (isRevised === true)
  // milestones are already sorted in the backend by date
  @computed('project.sortedMilestones', 'id', 'displayName')
  get isRevised() {
    const projectMilestones = this.get('project.sortedMilestones');
    const currentMilestoneList = projectMilestones.filter(m => m.displayName === this.displayName);
    // check if the current milestone id matches the first in the list
    return this.id !== currentMilestoneList.firstObject.id;
  }

  // New milestone name based on isRevised
  @computed('isRevised', 'displayName')
  get orderSensitiveName() {
    if (this.isRevised) return `Revised ${this.displayName}`;
    return this.displayName;
  }

  @computed('dcpPlannedcompletiondate')
  get remainingDays() {
    const MILLISECONDS_MULTIPLIER = 60000;
    const dateStart = new Date();
    const { dcpPlannedcompletiondate } = this;

    const dateEnd = new Date(dcpPlannedcompletiondate);
    const remainingTimeInterval = dateEnd.getTime() - dateStart.getTime()
      - ((dateEnd.getTimezoneOffset() - dateStart.getTimezoneOffset()) * MILLISECONDS_MULTIPLIER);

    // get date diff by accounting for DST
    return getTimeDiffText(remainingTimeInterval);
  }

  @computed('project.dcpPublicstatus', 'dcpMilestone', 'dcpActualstartdate', 'dcpActualenddate', 'dcpReviewmeetingdate')
  get displayDate() {
    const projectPublicStatus = this.project.get('dcpPublicstatus');

    let displayDate = null;

    if ([
      BOROUGH_BOARD_REFERRAL,
      BOROUGH_PRESIDENT_REFERRAL,
      COMMUNITY_BOARD_REFERRAL,
      CITY_COUNCIL_REVIEW,
      CPC_PUBLIC_MEETING_PUBLIC_HEARING,
      EIS_DRAFT_SCOPE_REVIEW,
      FEIS_SUBMITTED_AND_REVIEW,
      MAYORAL_VOTE,
    ].includes(this.dcpMilestone) && projectPublicStatus !== DCPPUBLICSTATUS_OPTIONSET.FILED) {
      displayDate = this.dcpActualstartdate;
    }

    if (this.dcpMilestone === FILED_EAS_REVIEW) {
      displayDate = this.dcpActualstartdate;
    }

    if ([
      FINAL_LETTER_SENT,
      FINAL_SCOPE_OF_WORK_ISSUED,
      CPC_PUBLIC_MEETING_VOTE,
      DEIS_PUBLIC_HEARING_HELD,
      NOC_OF_DRAFT_EIS_ISSUED,
      REVIEW_SESSION_CERTIFIED_REFERRED,
    ].includes(this.dcpMilestone) && projectPublicStatus !== DCPPUBLICSTATUS_OPTIONSET.FILED) {
      displayDate = this.dcpActualenddate;
    }

    if ([
      EIS_PUBLIC_SCOPING_MEETING,
      PREPARE_FILED_LAND_USE_APPLICATION,
      LAND_USE_FEE_PAYMENT,
      CEQR_FEE_PAYMENT,
      CPC_REVIEW_OF_COUNCIL_MODIFICATION,
      DEIS_SCOPE_OF_WORK_RELEASED,
      SCOPING_MEETING,
    ].includes(this.dcpMilestone)) {
      displayDate = this.dcpActualenddate;
    }

    if ([
      REVIEW_SESSION_CERTIFIED_REFERRED, // aka 'Application Reviewed at City Planning Commission Review Session'
      REVIEW_SESSION_PRE_HEARING_REVIEW_POST_REFERRAL, // aka 'Review Session - Pre-Hearing Review / Post Referral'
      CPC_PUBLIC_MEETING_PUBLIC_HEARING, // aka 'CPC Public Meeting - Public Hearing' a.k.a 'City Planning Commission Review'
      REVIEW_SESSION_POST_HEARING_FOLLOW_UP_FUTURE_VOTES, // aka 'Review Session - Post Hearing Follow-Up / Future Votes'
      CPC_PUBLIC_MEETING_VOTE, // aka 'City Planning Commission Vote'
    ].includes(this.dcpMilestone)) {
      if (this.dcpReviewmeetingdate) {
        const reviewMeetingDate = new Date(this.dcpReviewmeetingdate);

        if (Date.now() >= reviewMeetingDate.getTime()) {
          displayDate = this.dcpReviewmeetingdate;
        }
      }
    }

    return displayDate;
  }

  @computed('project.dcpPublicstatus', 'dcpMilestone', 'dcpActualenddate', 'dcpPlannedcompletiondate')
  get displayDate2() {
    const projectPublicStatus = this.project.get('dcpPublicstatus');

    if ([
      BOROUGH_BOARD_REFERRAL,
      BOROUGH_PRESIDENT_REFERRAL,
      COMMUNITY_BOARD_REFERRAL,
      CITY_COUNCIL_REVIEW,
      CPC_PUBLIC_MEETING_PUBLIC_HEARING,
      MAYORAL_VOTE,
    ].includes(this.dcpMilestone) && projectPublicStatus !== DCPPUBLICSTATUS_OPTIONSET.FILED) {
      return this.dcpActualenddate || this.dcpPlannedcompletiondate;
    }

    return null;
  }
}
