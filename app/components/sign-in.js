import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { tagName } from '@ember-decorators/component';
import { action } from '@ember/object';
import ENV from 'labs-zap-search/config/environment';

@tagName('')
export default class SignInComponent extends Component {
  oauthEndpoint = ENV.OAUTH_ENDPOINT;

  @service
  session

  @action
  logout() {
    this.session.invalidate();
  }
}
