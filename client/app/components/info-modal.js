import Component from '@ember/component';
import { action } from '@ember/object';

export default class InfoModalComponent extends Component {
  // We have manually overridden this to hide the modal by default when running tests in tests/index.html
  open = ENV.showCeqr === true && window.localStorage.hideCeqrFilterMessage !== 'true';

  dontShowModalAgain = false;

  @action
  closeModal() {
    this.set('open', false);
    if (this.dontShowModalAgain) {
      window.localStorage.hideCeqrFilterMessage = true;
    }
  }
}
