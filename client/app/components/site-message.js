import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SiteMessage extends Component {
  constructor(...args) {
    super(...args);

    if (this.cookies.exists('covid-message')) {
      this.set('open', false);
    } else {
      const now = new Date();
      this.cookies.write('covid-message', 'true', {
        expires: new Date(now.getTime() + 7 * 24 * 60 * 30 * 1000),
      });
    }
  }

  @service
  cookies;

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
