import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default class ProjectMilestoneComponent extends Component {
  tagName = 'li';

  classNameBindings = ['getClassNames'];

  // @argument
  milestone;

  milestoneParticipantReviewLookup = {
    BP: 'Borough President Review',
    BB: 'Borough Board Review',
    CB: 'Community Board Review',
  }

  milestoneRecommendationLookup = {
    49: 'dcpBoroughpresidentrecommendation', // Borough President Review milestone
    50: 'dcpBoroughboardrecommendation', // Borough Board Review milestone
    48: 'dcpCommunityboardrecommendation', // Community Board Review milestone
  }

  @computed('tense')
  get getClassNames() {
    const { tense } = this;
    return `grid-x grid-padding-small milestone ${tense}`;
  }

  // An array of disposition models that match the current milestone
  @computed('milestone', 'milestone.project.dispositions')
  get currentMilestoneDispositions() {
    const currentMilestoneDispositions = [];

    const milestone = this.get('milestone');
    // ALL dispositions associated with a milestone's project
    const dispositions = milestone.get('project.dispositions');
    const milestoneParticipantReviewLookup = this.get('milestoneParticipantReviewLookup');
    // this.get('milestoneRecommendationLookup')[milestone.dcpMilestonesequence] = e.g. `dcpCommunityboardrecommendation`
    const milestoneRecommendation = this.get('milestoneRecommendationLookup')[milestone.dcpMilestonesequence];

    // iterate through the ALL of the current project's dispositions
    // IF a single disposition's user's landUseParticipant property matches the
    // current milestone's displayName, push that disposition into the new
    // currentMilestoneDispositions array
    dispositions.forEach(function(disposition) {
      // grab the third and fourth letters e.g. "QNBP4" --> "BP"
      const participantType = disposition.get('user.landUseParticipant').substring(2, 4);

      // milestoneParticipantReviewLookup[participantType] = e.g. `Community Board Review`
      if (milestone.displayName === milestoneParticipantReviewLookup[participantType]) {
        currentMilestoneDispositions.push(disposition);
      };
    });

    // iterate through the currentMilestoneDispositions array and set a new property participantRecommendation.
    // This property will be set to the corresponding recommendation associated with the current milestone
    // e.g. `dcpCommunityboardrecommendation`
    currentMilestoneDispositions.forEach(function(disposition) {
      // disposition[milestoneRecommendation] = e.g. 'Approved'
      disposition.set('participantType', disposition.get('user.landUseParticipant').substring(2, 4));
      disposition.set('participantRecommendation', disposition[milestoneRecommendation]);
    });

    // if dispositions have been pushed to the array (its length is greater than 1)
    // return arrray -- otherwise return null
    if (currentMilestoneDispositions.length < 1) {
      return null;
    } return currentMilestoneDispositions;
  }

  // Checks whether all necessary vote properties for the milestone's dispositions have been submitted
  @computed('currentMilestoneDispositions.@each.{dcpDateofvote,dcpVotinginfavorrecommendation,dcpVotingagainstrecommendation,dcpVotingabstainingonrecommendation,participantRecommendation}')
  get votesSubmitted() {
    const dispositions = this.get('currentMilestoneDispositions');

    // arrays of each disposition's relevant property
    const dateOfVote = dispositions.map(disp => disp.dcpDateofvote);
    const votingInFavor = dispositions.map(disp => disp.dcpVotinginfavorrecommendation);
    const votingAgainst = dispositions.map(disp => disp.dcpVotingagainstrecommendation);
    const votingAbstaining = dispositions.map(disp => disp.dcpVotingabstainingonrecommendation);
    const participantRecommendation = dispositions.map(disp => disp.participantRecommendation);

    // check that arrays have a lenght greater than 0
    const arraysLengthOver0 = dateOfVote.length > 0 &&
    votingInFavor.length > 0 &&
    votingAgainst.length > 0 &&
    votingAbstaining.length > 0 &&
    participantRecommendation.length > 0;

    // check that each array's items have truthy values
    const arraysHaveTruthyItems =
    dateOfVote.every(date => !!date) &&
    votingInFavor.every(votes => !!votes) &&
    votingAgainst.every(votes => !!votes) &&
    votingAbstaining.every(votes => !!votes) &&
    participantRecommendation.every(rec => !!rec);

    return arraysLengthOver0 && arraysHaveTruthyItems;
  }

  // if the each dcpPublichearinglocation and dcpDateofpublichearing properties are filled in currentMilestoneDispositions array,
  // then hearings have been submitted for that project
  @computed('currentMilestoneDispositions.@each.{dcpPublichearinglocation,dcpDateofpublichearing}')
  get hearingsSubmitted() {
    const dispositions = this.get('currentMilestoneDispositions');
    // array of hearing locations
    const dispositionHearingLocations = dispositions.map(disp => `${disp.dcpPublichearinglocation}`);
    // array of hearing dates
    const dispositionHearingDates = dispositions.map(disp => disp.dcpDateofpublichearing);
    // hearingsSubmittedForProject checks whether each item in array is truthy
    const arraysFilled = dispositionHearingLocations.length > 0 && dispositionHearingDates.length > 0;
    const hearingsSubmittedForProject = arraysFilled && dispositionHearingLocations.every(location => !!location) && dispositionHearingDates.every(date => !!date);
    return hearingsSubmittedForProject;
  }

  // if all dcpPublichearinglocation in currentMilestoneDispositions array equal "waived",
  // then hearings have been waived
  @computed('currentMilestoneDispositions.@each.dcpPublichearinglocation')
  get hearingsWaived() {
    const dispositions = this.get('currentMilestoneDispositions');
    // array of hearing locations
    const dispositionHearingLocations = dispositions.map(disp => `${disp.dcpPublichearinglocation}`);
    // each location field equal to 'waived'
    const hearingsWaived = dispositionHearingLocations.length > 0 && dispositionHearingLocations.every(location => location === 'waived');
    return hearingsWaived;
  }

  // one of 'past', 'present', or 'future'
  @computed('milestone.{displayDate,displayDate2}')
  get tense() {
    const date1 = this.get('milestone.displayDate');
    const date2 = this.get('milestone.displayDate2');

    if (!date2 && moment(date1).isBefore()) { return 'past'; }

    if (moment(date1).isBefore() && moment(date2).isBefore()) { return 'past'; }

    if (moment(date1).isBefore() && !moment(date2).isBefore()) { return 'present'; }

    if (!date1) { return 'future no-dates'; }

    return 'future';
  }

  @computed('tense', 'milestone.{displayDate,displayDate2}')
  get timeRelativeToNow() {
    const tense = this.get('tense');
    const date1 = this.get('milestone.displayDate');
    const date2 = this.get('milestone.displayDate2');

    if (!date1) {
      return '';
    }

    if (tense === 'past' && date2) {
      return moment(date2).fromNow();
    }

    if (tense === 'past' && !date2) {
      return moment(date1).fromNow();
    }

    if (tense === 'future' && date1) {
      return moment(date1).fromNow();
    }

    return 'In Progress';
  }
}
