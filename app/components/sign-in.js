import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember/object';

@tagName('')
export default class SignInComponent extends Component {
  @service
  session

  @action
  logout() {
    this.session.invalidate();
  }

  @computed('session.data.authenticated')
  get parsedJWT() {
    const { access_token } = this.session.data.authenticated;

    if (!access_token) return {};

    const decodedToken = atob(access_token.split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/'));

    return JSON.parse(decodedToken);
  }
}
