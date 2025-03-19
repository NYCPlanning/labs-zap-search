import Component from '@ember/component';
import { action } from '@ember/object';
import ENV from 'labs-zap-search/config/environment';

export default class InfoModalComponent extends Component {
  // We have manually overridden this to hide the modal by default when running tests in tests/index.html
  open = ENV.showAlerts === true && window.localStorage.hideMessage !== 'true';

  dontShowModalAgain = false;

  @action
  closeModal() {
    this.set('open', false);
    if (this.dontShowModalAgain) {
      window.localStorage.hideMessage = true;
    }
  }
}
