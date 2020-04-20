import Component from '@ember/component';
import { action } from '@ember/object';

export default class SiteMessage extends Component {
  // @argument
  message = false;

  // @argument
  warning = false;

  // @argument
  open = true;

  // @argument
  dismissible = false;

  @action
  handleSiteMessageToggle() {
    this.set('open', !this.get('open'));
  }
}
