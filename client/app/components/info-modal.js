import Component from '@ember/component';
import { action } from '@ember/object';

export default class InfoModalComponent extends Component {
  open = !window.localStorage.hideMessage;

  dontShowModalAgain = false;

  @action
  closeModal() {
    this.set('open', false);
    if (this.dontShowModalAgain) {
      window.localStorage.hideMessage = true;
    }
  }
}
