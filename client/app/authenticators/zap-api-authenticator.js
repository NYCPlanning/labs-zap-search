import fetch from 'fetch';
import ENV from 'labs-zap-search/config/environment';
import { InvalidError } from '@ember-data/adapter/error';
import OAuth2ImplicitGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-implicit-grant';

export default class ZAPAuthenticator extends OAuth2ImplicitGrantAuthenticator {
  // @service
  // store

  // async _fetchUserObject() {
  //   const user = await this.store.queryRecord('user', { me: true });

  //   return { id: user.id, ...user.toJSON() };
  // }

  async authenticate(...args) {
    let accessToken;

    try {
      const { access_token } = await super.authenticate(...args);

      accessToken = access_token;
    } catch (e) {
      throw new InvalidError([{ detail: e, message: 'Please login again or contact DCP.' }]);
    }

    // returns an http cookie to implicitly authenticate later requests
    const response = await fetch(`${ENV.host}/login?accessToken=${accessToken}`, {
      mode: 'same-origin',
      credentials: 'include',
    });

    if (!response.ok) throw await response.json();

    return response.json();
  }
}
