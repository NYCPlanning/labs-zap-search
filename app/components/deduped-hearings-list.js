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
    const duplicateObject = accumulator.find(item => item.disposition.get(uniqueField1).toString() === current.disposition.get(uniqueField1).toString() && item.disposition.get(uniqueField2).toString() === current.disposition.get(uniqueField2).toString());

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

export default class DedupedHearingsListComponent extends Component {
  dispositions = [];

  @computed('dispositions')
  get dedupedHearings() {
    const newDispositionsArray = [];

    // setting a new property on each disposition called hearingActions which is an array of objects
    // property hearingActions is initally set to an array of the current disposition's action model.
    // During the reduce, if there is a duplicate in the array of dispositions,
    // the actions model for that duplicate disposition is pushed into this array

    // setting a new property--each disposition in the deduped list will have an array of its duplicate dispositions
    // property duplicateDisps is initally set to an array of the current disposition model (itself)
    // During the reduce, if there is a duplicate in the array of dispositions,
    // that duplicate disposition is pushed into this array

    this.dispositions.forEach(function(currentDisp) {
      newDispositionsArray.push(
        {
          disposition: currentDisp,
          hearingActions: [currentDisp.action],
          duplicateDisps: [currentDisp],
        },
      );
    });

    // function to deduplicate dispositions based on dcpPublichearinglocation & dcpDateofpublichearing
    // each disposition object in the new deduped array will have a property hearingActions and duplicateDisps, both arrays of objects
    // hearingActions is an array of action model objects that are concatenated across all duplicate objects
    // duplicateDisps is an array of disposition model objects that are concatenated across all duplicate objects
    return dedupeAndExtract(newDispositionsArray, 'dcpPublichearinglocation', 'dcpDateofpublichearing', 'action', 'hearingActions', 'duplicateDisps');
  }
}
