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

export function checkHearingsSubmitted(records = []) {
  const dispositionHearingsLocations = records.map(disp => `${disp.dcpPublichearinglocation}`);
  const dispositionHearingsDates = records.map(disp => disp.dcpDateofpublichearing);
  // checks whether each item in array is truthy
  return dispositionHearingsLocations.every(item => !!item) && dispositionHearingsDates.every(item => !!item);
}

export function checkHearingsWaived(records = []) {
  const dispositionHearingsLocations = records.map(disp => `${disp.dcpPublichearinglocation}`);
  // checks whether each item in array === 'waived'
  return dispositionHearingsLocations.every(item => item === 'waived');
}

export default class HearingsListForMilestonesListComponent extends Component {
  // @argument
  milestone;

  milestoneParticipantReviewLookup = {
    BP: 'Borough President Review',
    BB: 'Borough Board Review',
    CB: 'Community Board Review',
  }

  // An array of disposition models that match the current milestone that is passed in
  @computed('milestone', 'milestone.project.dispositions')
  get currentMilestoneDispositions() {
    const milestone = this.get('milestone');
    // ALL dispositions associated with a milestone's project
    const dispositions = milestone.get('project.dispositions');
    const milestoneParticipantReviewLookup = this.get('milestoneParticipantReviewLookup');


    // Iterate through ALL of the current project's dispositions.
    // Filter by IF a single disposition's dcpRecommendationsubmittedbyname matches the
    // current milestone's displayName based on the milestoneParticipantReviewLookup.
    // disposition.dcpRecommendationsubmittedbyname = e.g. 'QNBP'
    // disposition.dcpRecommendationsubmittedbyname.substring(2,4) = e.g. 'BP'
    // matching e.g. 'BP' with the milestoneParticipantReviewLookup provides 'Borough President Review'
    return dispositions.filter(disposition => milestone.displayName === milestoneParticipantReviewLookup[disposition.dcpRecommendationsubmittedbyname.substring(2, 4)]);
  }

  // An array of objects that contain the `landUseParticipantFullName` value and an array of dispositions that match that landUseParticipantFullName
  @computed('currentMilestoneDispositions')
  get milestoneParticipants() {
    const currentMilestoneDispositions = this.get('currentMilestoneDispositions');
    // Map new object where recommendationSubmittedByFullName property on disposition
    // is easily accessible as landUseParticipantFullName.
    // When deduplicated, userDispositions will be an array of ALL dispositions
    // associated with ONE landUseParticipantFullName
    const milestoneParticipants = currentMilestoneDispositions.map(disp => ({
      landUseParticipantFullName: disp.recommendationSubmittedByFullName,
      disposition: disp,
      userDispositions: [disp],
      hearingsSubmitted: false,
      hearingsWaived: false,
    }));

    // deduplicate based on landUseParticipantFullName property
    // concatenate all dispositions associated with that participant in userDispositions
    const milestoneParticipantsDeduped = dedupeByParticipant(milestoneParticipants);

    // In order to check whether dispositions for each participant has hearingsSubmitted or hearingsWaived
    // iterate through a single participant's userDispositions and check that
    // dcpPublichearinglocation and dcpDateofpublichearing are truthy (for hearingsSubmitted) OR
    // dcpPublichearinglocation === 'waived' (for hearingsWaived)
    // checking hearingsSubmitted/hearingsWavied is necessary for when we pass userDispositions into deduped-hearings-list
    milestoneParticipantsDeduped.forEach(function(participant) {
      participant.hearingsSubmitted = checkHearingsSubmitted(participant.userDispositions);
      participant.hearingsWaived = checkHearingsWaived(participant.userDispositions);
    });

    return milestoneParticipantsDeduped;
  }
}
