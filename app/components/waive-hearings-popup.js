import Component from '@ember/component';
import { action } from '@ember/object';

// set property in each object of the array to same value
export function updateEachObjectInArray(records = [], prop, newVal) {
  records.forEach(function(obj) {
    obj.set(prop, newVal);
  });
}

export default class WaiveHearingsPopupComponent extends Component {
  showPopup = false;

  // run function updateEachObjectInArray on dispositions array
  // occurs when a user chooses to opt out of hearings for their project
  @action
  onConfirmOptOutHearing(dispositions) {
    updateEachObjectInArray(dispositions, 'dcpPublichearinglocation', 'waived');
    this.set('showPopup', false);
  }

  // when a user clicks "cancel" button on opt out of hearings confirmation popup
  @action
  closeOptOutHearingPopup() {
    this.set('showPopup', false);
  }
}
