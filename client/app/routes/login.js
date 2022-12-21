import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

function _parseResponse(locationHash) {
  const params = {};
  const query = locationHash.substring(locationHash.indexOf('?'));
  const regex = /([^#?&=]+)=([^&]*)/g;
  let match;

  // decode all parameter pairs
  while ((match = regex.exec(query)) !== null) { // eslint-disable-line
    params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
  }
  return params;
}

export default class LoginRoute extends Route {
  @service
  session

  // hit /login in backend
  async beforeModel() {
    // try to authenticate with the url#access_token
    // & with the zap api CRM-authenticated
    await this.session.authenticate('authenticator:zap-api-authenticator', _parseResponse(window.location.hash));

    await this.store.queryRecord('user', { me: true });
  }

  afterModel() {
    this.transitionTo('my-projects.to-review');
  }
}
