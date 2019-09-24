import Component from '@ember/component';
import { computed } from '@ember/object';

// reduce function to remove duplicates from an array of objects based on two fields
// the duplicate objects, other than the first duplicate in the list, are removed
// then their information is concatenated into new properties on that object
// One property is concatenated across all duplicates and stored as arrayOfConcatProps (property on new array)
// All duplicate objects are stored as an array of objects arrayOfDuplicateObjects (property on new array)
export function dedupeAndExtract(records = [], uniqueField1, uniqueField2, propToConcat, arrayOfConcatProps, arrayOfDuplicateObjects) {
  return records.reduce((accumulator, current) => {
    // object that represents a match between accumulator and current based on two similar fields
    const duplicateObject = accumulator.find(item => item.get(uniqueField1).toString() === current.get(uniqueField1).toString() && item.get(uniqueField2).toString() === current.get(uniqueField2).toString());

    // if an object exists in accumulator that matches the current object
    if (duplicateObject) {
      // grab the property that is to be concatenated across duplicates
      // e.g. an array of actions associated with duplicate objects
      const concatProp = current.get(propToConcat);
      // push this concatProp into the concatenated property array on the matched object in the accumulator
      duplicateObject.get(arrayOfConcatProps).push(concatProp);
      // push the current duplicate object into the array of duplicate objects on the accumulator
      duplicateObject.get(arrayOfDuplicateObjects).push(current);

      return accumulator;
    } // if the properties DO NOT match, concatenate current object to accumulator array
    return accumulator.concat([current]);
  }, []);
}

export default class DedupedHearingsListComponent extends Component {
  // the actions "attribute" to display in the hearings list e.g. "ulurpnumber" or 'name'
  // this is set when the component is rendered
  subMilestone = false;

  // array of dispositions
  // if we are displaying a list of hearings for a particular user
  @computed('dispositions')
  get dedupedHearingsForUser() {
    const dispositions = this.get('dispositions');

    // setting a new property on each disposition called hearingActions which is an array of objects
    // property hearingActions is initally set to an array of the current disposition's action model.
    // During the reduce, if there is a duplicate in the array of dispositions,
    // the actions model for that duplicate disposition is pushed into this array
    dispositions.forEach(function(disposition) {
      disposition.set('hearingActions', [disposition.action]);
    });

    // setting a new property--each disposition in the deduped list will have an array of its duplicate dispositions
    // property duplicateDisps is initally set to an array of the current disposition model (itself)
    // During the reduce, if there is a duplicate in the array of dispositions,
    // that duplicate disposition is pushed into this array
    dispositions.forEach(function(disposition) {
      disposition.set('duplicateDisps', [disposition]);
    });

    // function to deduplicate dispositions based on dcpPublichearinglocation & dcpDateofpublichearing
    // each disposition object in the new deduped array will have a property hearingActions and duplicateDisps, both arrays of objects
    // hearingActions is an array of action model objects that are concatenated across all duplicate objects
    // duplicateDisps is an array of disposition model objects that are concatenated across all duplicate objects
    return dedupeAndExtract(dispositions, 'dcpPublichearinglocation', 'dcpDateofpublichearing', 'action', 'hearingActions', 'duplicateDisps');
  }

  // array of dispositions
  // if we are displaying a list of hearings for a specific milestone
  // set subMilestone = true when render the component
  @computed('dispositions')
  get dedupedHearingsForMilestone() {
    const dispositions = this.get('dispositions');

    dispositions.forEach(function(disposition) {
      disposition.set('milestoneHearingActions', [disposition.action]);
    });

    dispositions.forEach(function(disposition) {
      disposition.set('duplicateDisps', [disposition]);
    });
    return dedupeAndExtract(dispositions, 'dcpPublichearinglocation', 'dcpDateofpublichearing', 'action', 'milestoneHearingActions', 'duplicateDisps');
  }
}
