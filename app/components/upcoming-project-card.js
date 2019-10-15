import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class UpcomingProjectCardComponent extends Component {
  @service
  currentUser;

  assignment = {};

  showPopup = false;

  @action
  openOptOutHearingPopup() {
    this.set('showPopup', true);
  }
}
