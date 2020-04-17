import Component from '@ember/component';
import ENV from 'labs-zap-search/config/environment';
import { action } from '@ember/object';

export default class DoLogout extends Component {
  nycIDHost = ENV.NYC_ID_HOST;

  origin = window.location.origin;

  iFrameDidLoad = false;

  @action
  didLogoutNycId() {
    this.set('iFrameDidLoad', true);
  }
}
