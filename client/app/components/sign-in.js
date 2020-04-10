import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { tagName } from '@ember-decorators/component';
import { action } from '@ember/object';
import ENV from 'labs-zap-search/config/environment';

@tagName('')
export default class SignInComponent extends Component {
  oauthEndpoint = ENV.OAUTH_ENDPOINT;

  showAuthModal = false;

  @service
  session

  @service
  router

  @action
  logout() {
    this.session.invalidate();

    this.router.transitionTo('logout');
  }

  @action
  toggleAuthModal() {
    if (ENV.environment === 'development') {
      window.location.hash = 'access_token=asdf';
      this.router.transitionTo('/login');
    } else {
      this.set('showAuthModal', !this.get('showAuthModal'));
    }
  }
}
