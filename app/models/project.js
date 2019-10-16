import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

const {
  Model, attr, hasMany,
} = DS;

const EmptyFeatureCollection = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: null,
    properties: {
      isEmptyDefault: true,
    },
  }],
};

const COMMUNITY_BOARD_REFERRAL_MILESTONE_ID = '923beec4-dad0-e711-8116-1458d04e2fb8';
const BOROUGH_PRESIDENT_REFERRAL_MILESTONE_ID = '943beec4-dad0-e711-8116-1458d04e2fb8';
const BOROUGH_BOARD_REFERRAL_MILESTONE_ID = '963beec4-dad0-e711-8116-1458d04e2fb8';

const MILESTONE_ID_LOOKUP = {
  CB: COMMUNITY_BOARD_REFERRAL_MILESTONE_ID,
  BP: BOROUGH_PRESIDENT_REFERRAL_MILESTONE_ID,
  BB: BOROUGH_BOARD_REFERRAL_MILESTONE_ID,
};

export default class ProjectModel extends Model {
  @service
  milestoneConstants;

  // Many Users to Many Projects
  @hasMany('user') users;

  // Many Actions to One Project
  @hasMany('action', { async: false }) actions;

  // Many Dispositions to One Project
  @hasMany('disposition', { async: false }) dispositions;

  // ONE Project Has Many User Project Participant Types
  @hasMany('userProjectParticipantType') userProjectParticipantTypes;

  @hasMany('milestone', { async: false }) milestones;

  // Attributes for dashboard view
  @attr() tab;

  @attr() dcpLupteammemberrole;

  @attr() applicantteam;

  @computed('milestones')
  get publicReviewPlannedStartDate() {
    const { dcpPlannedstartdate } = this.milestones.find(milestone => milestone.dcpMilestone === COMMUNITY_BOARD_REFERRAL_MILESTONE_ID) || {};
    return dcpPlannedstartdate || null;
  }

  @computed('milestones')
  get tabSpecificMilestones() {
    return this.milestones.filter(milestone => this.milestoneConstants.milestoneListByTabLookup[this.tab].includes(milestone.dcpMilestone));
  }

  // The following <tab>MilestoneActual<Start/End>
  // date fields represent different dates from different milestones
  // depending on `tab`:

  // If `tab` is `upcoming`...
  // if the project is in public review, this field is used to display the participant's review planned start date.
  // else this field returns null
  @computed('tab', 'dcpLupteammemberrole', 'milestones')
  get upcomingMilestonePlannedStartDate() {
    if (this.tab === 'upcoming') {
      if (this.dcpPublicstatusSimp !== 'Filed') {
        const participantMilestoneId = MILESTONE_ID_LOOKUP[this.dcpLupteammemberrole];
        const participantReviewMilestone = this.milestones.find(milestone => milestone.dcpMilestone === participantMilestoneId);
        return participantReviewMilestone ? participantReviewMilestone.dcpPlannedstartdate : null;
      }
    }
    return null;
  }

  // If `tab` is to-review', these start/end dates are derived from
  // the participant's (specified by `dcpLupteammemberrole`) review milestone.
  @computed('tab', 'dcpLupteammemberrole', 'milestones')
  get toReviewMilestoneActualStartDate() {
    if (this.tab !== 'to-review') {
      return null;
    }
    const participantMilestoneId = MILESTONE_ID_LOOKUP[this.dcpLupteammemberrole];
    const { dcpActualstartdate } = this.milestones.find(milestone => milestone.dcpMilestone === participantMilestoneId) || {};
    return dcpActualstartdate;
  }

  @computed('tab', 'dcpLupteammemberrole', 'milestones')
  get toReviewMilestoneActualEndDate() {
    if (this.tab !== 'to-review') {
      return null;
    }
    const participantMilestoneId = MILESTONE_ID_LOOKUP[this.dcpLupteammemberrole];
    const { dcpActualenddate } = this.milestones.find(milestone => milestone.dcpMilestone === participantMilestoneId) || {};
    return dcpActualenddate;
  }

  // If `tab` is 'reviewed'...
  //   - these start/end dates come from the current In Progress milestone
  //   - an array of milestone dates is returned
  @computed('tab', 'dcpLupteammemberrole', 'milestones')
  get reviewedMilestoneActualStartEndDates() {
    if (this.tab !== 'reviewed') {
      return null;
    }
    const inProgressMilestones = this.milestones.filter(milestone => milestone.statuscode === 'In Progress');
    return inProgressMilestones.map(milestone => ({
      milestone: milestone.dcpMilestone,
      displayName: milestone.displayName,
      dcpActualstartdate: milestone.dcpActualstartdate,
      dcpActualenddate: milestone.dcpActualenddate,
    }));
  }

  // array of applicant objects
  @attr() applicants;

  @attr('string') dcpName;

  @attr() dcpApplicanttype;

  @attr() dcpBorough;

  @attr('string') dcpCeqrnumber;

  @attr() dcpCeqrtype;

  @attr('string') dcpCertifiedreferred;

  @attr('boolean') dcpFemafloodzonea;

  @attr('boolean') dcpFemafloodzonecoastala;

  @attr('boolean') dcpFemafloodzoneshadedx;

  @attr('boolean') dcpFemafloodzonev;

  @attr('boolean') dcpSisubdivision;

  @attr('boolean') dcpSischoolseat;

  @attr('string') dcpProjectbrief;

  @attr('string') dcpProjectname;

  @attr('string', { defaultValue: '' }) dcpPublicstatus;

  @attr('string', { defaultValue: '' }) dcpPublicstatusSimp;

  @attr('string') dcpProjectcompleted;

  @attr() dcpHiddenprojectmetrictarget;

  @attr('string') dcpUlurpNonulurp;

  @attr() dcpCommunitydistrict;

  @attr('string') dcpCommunitydistricts;

  @attr('string') dcpValidatedcommunitydistricts;

  @attr('boolean') hasCentroid;

  @attr() dcpBsanumber;

  @attr() dcpWrpnumber;

  @attr() dcpLpcnumber;

  @attr() dcpNydospermitnumber;

  @attr() bbls;

  @attr({ defaultValue: () => EmptyFeatureCollection })
  bblFeaturecollection;

  @attr() addresses;

  @attr() keywords;

  @attr() ulurpnumbers;

  @attr() center;

  @attr() lastmilestonedate;

  @attr() videoLinks;

  @computed('bblFeaturecollection')
  get bblFeatureCollectionSource() {
    const data = this.bblFeaturecollection;
    return {
      type: 'geojson',
      data,
    };
  }

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

  unknownProperty(key) {
    console.log(`Unexpected access of ${key} on ${this}`);
  }
}
