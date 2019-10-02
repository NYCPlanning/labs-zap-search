import Component from '@ember/component';
import { computed } from '@ember/object';

export default class DedupedHearingsListComponent extends Component {
  // the actions "attribute" to display in the hearings list e.g. "ulurpnumber" or 'name'
  // this is set when the component is rendered
  attribute = '';

  @computed('project')
  get dedupedHearings() {
    const dispositions = this.get('project.dispositions');
    // an array of objects that have been reduced

    // setting a new property on each disposition called hearingActions which is an array of objects
    // this property hearingActions is initally set to an array of the current disposition's action model.
    // During the reduce, if there is a duplicate in the array of dispositions,
    // the actions model for that duplicate disposition is pushed into this array
    dispositions.forEach(function(disposition) {
      disposition.set('hearingActions', [disposition.action]);
    });

    // each disposition in the deduped list will have an array of its duplicate dispositions
    dispositions.forEach(function(disposition) {
      disposition.set('duplicateDisps', [disposition]);
    });

    // reduce method to deduplicate dispositions based on location and date of hearing
    // TODO: move this reduce into own function
    return dispositions.reduce((accumulatedDisps, currentDisp) => {
      // object that represents a match between accumulatedDisps and the currentDisp
      const duplicateObject = accumulatedDisps.find(item => item.dcpPublichearinglocation === currentDisp.dcpPublichearinglocation && item.dcpDateofpublichearing.toString() === currentDisp.dcpDateofpublichearing.toString());

      // if an object exists in accumulatedDisps that matches the currentDisp
      if (duplicateObject) {
        // grab the actions model from the currentDisp
        const currentDispAction = currentDisp.get('action');
        // push this into the hearingActions array on the matched object in accumulatedDisps
        duplicateObject.hearingActions.push(currentDispAction);
        duplicateObject.duplicateDisps.push(currentDisp);

        return accumulatedDisps;
      } // if the properties DO NOT match, concatenate currentDisp object to array
      return accumulatedDisps.concat([currentDisp]);
    }, []);
  }
}
