import Component from '@ember/component';
import ENV from 'labs-zap-search/config/environment';
import { action } from '@ember/object';

export default class DoLogout extends Component {
  nycidLogoutBaseUrl = ENV.NYCID_LOGOUT_BASE_URL;

  origin = window.location.origin;

  iFrameDidLoad = false;

  @action
  didLogoutNycId() {
    this.set('iFrameDidLoad', true);
  }
}
