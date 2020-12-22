import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import fetch from 'fetch';
import location from 'ember-simple-auth/utils/location';
import { inject as service } from '@ember/service';
import ENV from 'labs-zap-search/config/environment';
import { InvalidError } from '@ember-data/adapter/error';
import OAuth2ImplicitGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-implicit-grant';

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

    return await response.json();
  }
}
