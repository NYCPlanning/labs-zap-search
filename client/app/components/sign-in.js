import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { tagName } from '@ember-decorators/component';
import { action } from '@ember/object';
import ENV from 'labs-zap-search/config/environment';

@tagName('')
export default class SignInComponent extends Component {
  showAuthModal = false;

  @service
  session

  @service
  router

  @service
  currentUser

  @action
  logout() {
    this.session.invalidate();

    this.router.transitionTo('logout');
  }

  @action
  toggleAuthModal() {
    this.set('showAuthModal', !this.get('showAuthModal'));
  }
}
