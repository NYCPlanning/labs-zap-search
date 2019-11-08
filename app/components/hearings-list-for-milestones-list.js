import Component from '@ember/component';
import { computed } from '@ember/object';

// Deduplicate an array of objects based on one field --> landUseParticipantFullName.
// While reducing, if there's a match, concatenate each disposition onto userDispositions property.
// userDispositions property is a concatenation of all dispositions associated with one landUseParticipantFullName
export function dedupeByParticipant(records = []) {
  return records.reduce((accumulator, current) => {
    // object that represents a match between accumulator and current based on one similar field
    const matchingFieldObject = accumulator.find(item => item.landUseParticipantFullName === current.landUseParticipantFullName);

    if (matchingFieldObject) {
      // push the current's disposition into the userDispositions property
      matchingFieldObject.userDispositions.push(current.disposition);
      // if there is a match, return just the accumulator.
      // only change is that the current's disposition is pushed into userDispositions array
      return accumulator;
    }
    // if there is no match, concatenate the current onto the accumulator array
    return accumulator.concat([current]);
  }, []);
}

// Check that two fields are truthy
export function checkHearingsSubmitted(records = []) {
  const dispositionHearingsLocations = records.map(disp => `${disp.dcpPublichearinglocation}`);
  const dispositionHearingsDates = records.map(disp => disp.dcpDateofpublichearing);
  // checks whether each item in array is truthy
  return dispositionHearingsLocations.every(item => !!item) && dispositionHearingsDates.every(item => !!item);
}

// Check that five fields are truthy
export function checkVotesSubmitted(records = [], recommendationType) {
  const dispositionDateofVote = records.map(disp => disp.get('dcpDateofvote'));
  const dispositionVotingInFavor = records.map(disp => disp.get('dcpVotinginfavorrecommendation'));
  const dispositionVotingAgainst = records.map(disp => disp.get('dcpVotingagainstrecommendation'));
  const dispositionAbstaining = records.map(disp => disp.get('dcpVotingabstainingonrecommendation'));
  const dispositionRecommendationType = records.map(disp => disp.get(recommendationType));
  // checks whether each item in array is truthy
  return dispositionDateofVote.every(vote => !!vote)
  && dispositionVotingInFavor.every(vote => !!vote)
  && dispositionVotingAgainst.every(vote => !!vote)
  && dispositionAbstaining.every(vote => !!vote)
  && dispositionRecommendationType.every(recType => !!recType);
}

export default class HearingsListForMilestonesListComponent extends Component {
  // @argument
  milestone;

  milestoneParticipantReviewLookup = {
    'Borough President Review': 'BP',
    'Borough Board Review': 'BB',
    'Community Board Review': 'CB',
  }

  participantRecommendationLookup = {
    BP: 'dcpBoroughpresidentrecommendation',
    BB: 'dcpBoroughboardrecommendation',
    CB: 'dcpCommunityboardrecommendation',
  }

  // An array of disposition models that match the current milestone that is passed in
  @computed('milestone', 'milestone.project.dispositions')
  get currentMilestoneDispositions() {
    const milestone = this.get('milestone');
    // ALL dispositions associated with a milestone's project
    const dispositions = milestone.get('project.dispositions');
    const milestoneParticipantReviewLookup = this.get('milestoneParticipantReviewLookup');

    const filteredDispositionsArray = [];

    // Iterate through ALL of the current project's dispositions.
    // Filter by IF a single disposition's dcpRecommendationsubmittedbyname matches the
    // current milestone's displayName based on the milestoneParticipantReviewLookup.
    // disposition.dcpRecommendationsubmittedbyname = e.g. 'QNBP'
    // disposition.dcpRecommendationsubmittedbyname.substring(2,4) = e.g. 'BP'
    // matching e.g. 'BP' with the milestoneParticipantReviewLookup provides 'Borough President Review'
    dispositions.forEach(function(disposition) {
      // make sure that dcpRecommendationsubmittedbyname is not NULL
      if (disposition.dcpRecommendationsubmittedbyname) {
        if (milestoneParticipantReviewLookup[milestone.displayName] === disposition.dcpRecommendationsubmittedbyname.substring(2, 4)) {
          filteredDispositionsArray.push(disposition);
        }
      }
    });
    return filteredDispositionsArray;
  }

  // An array of objects that contain the `landUseParticipantFullName` value and an array of dispositions that match that landUseParticipantFullName
  @computed('currentMilestoneDispositions')
  get milestoneParticipants() {
    // LOOKUPS
    const milestoneParticipantReviewLookup = this.get('milestoneParticipantReviewLookup');
    const participantRecommendationLookup = this.get('participantRecommendationLookup');

    // participant types
    // participantType = e.g. "CB"
    const participantType = milestoneParticipantReviewLookup[this.get('milestone.displayName')];
    // partRecType = e.g. 'dcpCommunityboardrecommendation'
    const partRecType = participantRecommendationLookup[participantType];

    const currentMilestoneDispositions = this.get('currentMilestoneDispositions');

    // Map new object where recommendationSubmittedByFullName property on disposition
    // is easily accessible as landUseParticipantFullName.
    // When deduplicated, userDispositions will be an array of ALL dispositions
    // associated with ONE landUseParticipantFullName.
    // Because dispositions have 3 types of recommendation fields based on the user that submitted them,
    // participantRecommendationType is important for displaying the correct recommendation (e.g. "Approved").
    // This participantRecommendationType is passed into `deduped-votes-list` to assure that we are deduplicating
    // by the correct recommenation field.
    const milestoneParticipants = currentMilestoneDispositions.map(disp => ({
      landUseParticipantFullName: disp.recommendationSubmittedByFullName,
      participantRecommendationType: partRecType, // e.g. 'dcpCommunityboardrecommendation'
      landUseParticipantType: disp.dcpRecommendationsubmittedbyname.substring(2, 4), // e.g. 'CB'
      disposition: disp,
      userDispositions: [disp],
      hearingsSubmitted: false,
      hearingsWaived: false,
    }));


    // deduplicate based on landUseParticipantFullName property
    // concatenate all dispositions associated with that participant in userDispositions
    const milestoneParticipantsDeduped = dedupeByParticipant(milestoneParticipants);

    // checking hearingsSubmitted/votesSubmitted is necessary for when
    // we pass userDispositions into deduped-hearings-list/deduped-votes-list
    milestoneParticipantsDeduped.forEach(function(participant) {
      participant.hearingsSubmitted = checkHearingsSubmitted(participant.userDispositions);
      participant.votesSubmitted = checkVotesSubmitted(participant.userDispositions, participant.participantRecommendationType);
    });

    return milestoneParticipantsDeduped;
  }
}
