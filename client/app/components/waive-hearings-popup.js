import Component from '@ember/component';
import { action } from '@ember/object';

export default class WaiveHearingsPopupComponent extends Component {
  showPopup = false;

  // run function updateEachObjectInArray on dispositions array
  // occurs when a user chooses to opt out of hearings for their project
  @action
  async onConfirmOptOutHearing(assignment) {
    const { dispositions } = assignment;
    dispositions.setEach('dcpIspublichearingrequired', 717170001);

    try {
      await dispositions.save();
      this.set('showPopup', false);
    } catch (e) {
      dispositions.setEach('dcpIspublichearingrequired', null);
      this.set('error', e);
    }
  }

  // when a user clicks "cancel" button on opt out of hearings confirmation popup
  @action
  closeModal() {
    this.set('showPopup', false);
  }
}
