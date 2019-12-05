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

// Check that at least ONE disposition has a truthy date & location field
// this is used to conditionally display the entire sub-milestone, including the title.
export function checkHearingsSubmitted(records = []) {
  const projectsWithHearings = records.filter(function(disp) {
    if (disp.dcpDateofpublichearing !== null) {
      return disp.dcpPublichearinglocation && disp.dcpDateofpublichearing.toString();
    } return null;
  });

  return projectsWithHearings.length > 0;
}

// Check that at least ONE disposition has truthy values for recommendation field
// this is used to conditionally display the entire sub-milestone, including the title.
export function checkVotesSubmitted(records = [], recommendationType) {
  const projectsWithVotes = records.filter(function(disp) {
    // null values and empty strings will NOT be returned
    return disp.get(recommendationType);
  });

  return projectsWithVotes.length > 0;
}

export default class HearingsListForMilestonesListComponent extends Component {
  // @argument
  milestone;

  milestoneParticipantReviewLookup = {
    'Borough President Review': 'Borough President',
    'Borough Board Review': 'Borough Board',
    'Community Board Review': 'Community Board',
  }

  participantRecommendationLookup = {
    'Borough President': 'dcpBoroughpresidentrecommendation',
    'Borough Board': 'dcpBoroughboardrecommendation',
    'Community Board': 'dcpCommunityboardrecommendation',
  }

  // An array of disposition models that match the current milestone that is passed in
  @computed('milestone', 'milestone.project.dispositions')
  get currentMilestoneDispositions() {
    const milestone = this.get('milestone');
    // ALL dispositions associated with a milestone's project
    const dispositions = milestone.get('project.dispositions');

    const milestoneParticipantReviewLookup = this.get('milestoneParticipantReviewLookup');

    // Iterate through ALL of the current project's dispositions.
    // Filter by IF a single disposition's fullname AND dcpRepresenting matches the
    // current milestone's displayName based on the milestoneParticipantReviewLookup.
    // disposition.fullname = e.g. 'QN BP'
    // ^^ borough boards have a fullname that is equal to the borough president name e.g. `BK BP`,
    // so disposition.dcpRepresenting is used in order to correctly match borough board dispositions to the BB milestone
    // disposition.dcpRepresenting = e.g. 'Community Board'
    // disposition.fullname.substring(2,4) = e.g. 'BP'
    // matching e.g. 'BP' with the milestoneParticipantReviewLookup provides 'Borough President Review'
    return dispositions.filter(function(disposition) {
      // make sure we aren't grabbing any null values; null values break substring
      const participantType = disposition.dcpRepresenting;
      return milestoneParticipantReviewLookup[milestone.displayName] === participantType;
    });
  }

  // An array of objects that contain the `landUseParticipantFullName` value and an array of dispositions that match that landUseParticipantFullName
  @computed('currentMilestoneDispositions')
  get milestoneParticipants() {
    // LOOKUPS
    const milestoneParticipantReviewLookup = this.get('milestoneParticipantReviewLookup');
    const participantRecommendationLookup = this.get('participantRecommendationLookup');

    // participant types
    // participantType = e.g. "Community Board"
    const participantType = milestoneParticipantReviewLookup[this.get('milestone.displayName')];
    // partRecType = e.g. 'dcpCommunityboardrecommendation'
    const partRecType = participantRecommendationLookup[participantType];

    const currentMilestoneDispositions = this.get('currentMilestoneDispositions');

    // Map new object where fullname property on disposition
    // is easily accessible as landUseParticipantFullName.
    // When deduplicated, userDispositions will be an array of ALL dispositions
    // associated with ONE landUseParticipantFullName.
    // Because dispositions have 3 types of recommendation fields based on the user that submitted them,
    // participantRecommendationType is important for displaying the correct recommendation (e.g. "Approved").
    // This participantRecommendationType is passed into `deduped-votes-list` to assure that we are deduplicating
    // by the correct recommenation field.
    const milestoneParticipants = currentMilestoneDispositions.map(disp => ({
      landUseParticipantFullName: disp.fullNameLongFormat,
      // field used for making sure we're grabbing the correct recommendation field
      participantRecommendationType: partRecType, // e.g. 'dcpCommunityboardrecommendation'
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
