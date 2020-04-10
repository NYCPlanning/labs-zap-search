import Component from '@ember/component';
import { action } from '@ember/object';

export default class ConfirmationModalComponent extends Component {
  open = false;

  @action
  closeModal() {
    this.set('open', false);
  }
}
