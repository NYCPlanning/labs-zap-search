import Component from '@ember/component';
import { action } from '@ember/object';
import config from '../../config/environment';

export default class InfoModalComponent extends Component {
  // We have manually overridden this to hide the modal by default when running tests in tests/index.html
  open = config.showAlerts === true && !window.localStorage.hideMessage;

  dontShowModalAgain = false;

  @action
  closeModal() {
    this.set('open', false);
    if (this.dontShowModalAgain) {
      window.localStorage.hideMessage = true;
    }
  }
}
