import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import fetch from 'fetch';
import location from 'ember-simple-auth/utils/location';
import { inject as service } from '@ember/service';
import ENV from 'labs-zap-search/config/environment';

// lifted from https://github.com/simplabs/ember-simple-auth/blob/master/addon/mixins/oauth2-implicit-grant-callback-route-mixin.js#L6
// parses a window hash and grabs the access token
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

export default class ZAPAuthenticator extends BaseAuthenticator {
  @service
  store

  async _fetchUserObject() {
    const user = await this.store.queryRecord('user', { me: true });

    return { id: user.id, ...user.toJSON() };
  }

  async authenticate() {
    const { access_token } = _parseResponse(location().hash);

    if (!access_token) {
      throw { errors: [{ detail: 'No access token present' }] }; // eslint-disable-line
    }

    // returns an http cookie to implicitly authenticate later requests
    const response = await fetch(`${ENV.host}/login?accessToken=${access_token}`, {
      mode: 'same-origin',
      credentials: 'include',
    });

    if (!response.ok) throw await response.json();

    return this._fetchUserObject();
  }

  restore() {
    // authentication is implicit with an httponly cookie
    // this request will fail if that cookie doesn't exist
    // https://github.com/simplabs/ember-simple-auth/blob/master/guides/managing-current-user.md#using-a-dedicated-endpoint
    return this._fetchUserObject();
  }
}
