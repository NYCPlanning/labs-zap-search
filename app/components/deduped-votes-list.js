import Component from '@ember/component';
import { computed } from '@ember/object';

// reduce function to remove duplicates from an array of objects based on five fields
// the duplicate objects, other than the first duplicate in the list, are removed
// then their information is concatenated into new properties on that object
// One property is concatenated across all duplicates and stored as arrayOfConcatProps (property on new array)
// All duplicate objects are stored as an array of objects arrayOfDuplicateObjects (property on new array)
export function dedupeAndExtract(records = [], participantRecommendationType, propToConcat, arrayOfConcatProps, arrayOfDuplicateObjects) {
  return records.reduce((accumulator, current) => {
    // object that represents a match between accumulator and current based on two similar fields
    const duplicateObject = accumulator.find(function(item) {
      // datesExist checks that the date fields are truthy before checking for duplicate objects
      // this is necessary because in order to compare dates, they must be converted to strings
      // running `toString` on a null value can cause an error
      const datesExist = item.disposition.get('dcpDateofvote') !== null && current.disposition.get('dcpDateofvote') !== null;

      if (datesExist) {
        return item.disposition.get('dcpDateofvote').toString() === current.disposition.get('dcpDateofvote').toString()
         && item.disposition.get('dcpVotinginfavorrecommendation') === current.disposition.get('dcpVotinginfavorrecommendation')
         && item.disposition.get('dcpVotingagainstrecommendation') === current.disposition.get('dcpVotingagainstrecommendation')
         && item.disposition.get('dcpVotingabstainingonrecommendation') === current.disposition.get('dcpVotingabstainingonrecommendation')
         && item.disposition.get(participantRecommendationType) === current.disposition.get(participantRecommendationType);
      }

      return null;
    });

    // if an object exists in accumulator that matches the current object
    if (duplicateObject) {
      // grab the property that is to be concatenated across duplicates
      // e.g. an array of actions associated with duplicate objects
      const concatProp = current.disposition.get(propToConcat);
      // push this concatProp into the concatenated property array on the matched object in the accumulator
      duplicateObject[arrayOfConcatProps].push(concatProp);
      // push the current duplicate object into the array of duplicate objects on the accumulator
      duplicateObject[arrayOfDuplicateObjects].push(current.disposition);

      return accumulator;
    } // if the properties DO NOT match, concatenate current object to accumulator array
    return accumulator.concat([current]);
  }, []);
}

export default class DedupedVotesListComponent extends Component {
  dispositions = [];

  @computed('dispositions', 'participantRecommendationType')
  get dedupedVotes() {
    // Each disposition has three recommendation fields for each type of user.
    // These include: 'dcpCommunityboardrecommendation', 'dcpBoroughpresidentrecommendation', and 'dcpBoroughboardrecommendation'.
    // In order to assure that we are checking the correct recommendation field,
    // participantRecommendationType is passed in when `deduped-votes-list` is rendered
    const participantRecommendationType = this.get('participantRecommendationType');

    // function for checking that all 5 required fields are truthy
    function checkAllFields(date, against, abstain, favor, recType) {
      if (date !== null) {
        // invalid date objects may still return truthy so in order to check that
        // the date object here is truthy, we must convert to string.
        // toString() will not run on a null value, so we must first assure
        // that the date field is not null
        return date.toString() && against && abstain && favor && recType;
      } return false;
    }

    // ** Setting a new property on each disposition called voteActions which is an array of objects.
    // The new property voteActions is initally set to an array of the current disposition's action model.
    // During the reduce, if there is a duplicate in the array of dispositions,
    // the actions model for that duplicate disposition is pushed into this array.
    // ** Setting a new property--each disposition in the deduped list will have an array of its duplicate dispositions.
    // The new property duplicateDisps is initally set to an array of the current disposition model (itself).
    // During the reduce, if there is a duplicate in the array of dispositions,
    // that duplicate disposition is pushed into this array.
    // ** dispHasAllFields checks whether the 5 required fields to show a vote are truthy
    // If dispHasAllFields is false, we do not display the vote information at all
    const newDispositionsArray = this.dispositions.map(disp => ({
      disposition: disp,
      // check that disposition has all 5 required fields
      dispHasAllFields: checkAllFields(disp.dcpDateofvote, disp.dcpVotingagainstrecommendation, disp.dcpVotingabstainingonrecommendation, disp.dcpVotinginfavorrecommendation, disp[participantRecommendationType]),
      voteActions: [disp.action],
      duplicateDisps: [disp],
    }));

    // function to deduplicate dispositions based on dcpDateofVote, dcpVotinginfavorrecommendation, dcpVotingagainstrecommendation,
    // dcpVotingabstainingonrecommendation, and a property that is set later `participantRecommendation` (e.g. 'dcpCommunityboardrecommendation')
    // each disposition object in the new deduped array will have a property voteActions and duplicateDisps, both arrays of objects
    // voteActions is an array of action model objects that are concatenated across all duplicate objects
    // duplicateDisps is an array of disposition model objects that are concatenated across all duplicate objects
    return dedupeAndExtract(
      newDispositionsArray,
      participantRecommendationType,
      'action',
      'voteActions',
      'duplicateDisps',
    );
  }
}
