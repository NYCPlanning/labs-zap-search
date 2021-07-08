import Component from '@ember/component';
import { action } from '@ember/object';
import {
  DCPISPUBLICHEARINGREQUIRED_OPTIONSET,

  STATUSCODES as DISPO_STATUSCODES,
  STATECODES as DISPO_STATECODES,
} from '../models/disposition/constants';


export default class WaiveHearingsPopupComponent extends Component {
  showPopup = false;

  // run function updateEachObjectInArray on dispositions array
  // occurs when a user chooses to opt out of hearings for their project
  @action
  async onConfirmOptOutHearing(assignment) {
    const { dispositions } = assignment;
    const dispoOriginalStatus = dispositions.firstObject.get('statuscode');
    const dispoOriginalState = dispositions.firstObject.get('statecode');

    dispositions.setEach('dcpIspublichearingrequired', DCPISPUBLICHEARINGREQUIRED_OPTIONSET.NO);
    dispositions.setEach('statuscode', DISPO_STATUSCODES.SAVED.label);
    dispositions.setEach('statecode', DISPO_STATECODES.ACTIVE.label);

    try {
      await dispositions.save();
      this.set('showPopup', false);
    } catch (e) {
      dispositions.setEach('dcpIspublichearingrequired', null);
      dispositions.setEach('statuscode', dispoOriginalStatus);
      dispositions.setEach('statecode', dispoOriginalState);

      this.set('error', e);
    }
  }

  // when a user clicks "cancel" button on opt out of hearings confirmation popup
  @action
  closeModal() {
    this.set('showPopup', false);
  }
}
