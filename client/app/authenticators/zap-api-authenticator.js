import fetch from 'fetch';
import ENV from 'labs-zap-search/config/environment';
import { InvalidError } from '@ember-data/adapter/error';
import OAuth2ImplicitGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-implicit-grant';
import jwtDecode from 'jwt-decode';

export default class ZAPAuthenticator extends OAuth2ImplicitGrantAuthenticator {
  async authenticate(...args) {
    let accessToken;

    try {
      const { access_token } = await super.authenticate(...args);

      accessToken = access_token;
    } catch (e) {
      throw new InvalidError([{ detail: e, message: 'Please login again or contact DCP.' }]);
    }

    const NYCIDUser = jwtDecode(accessToken);
    const { mail } = NYCIDUser;

    // returns an http cookie to implicitly authenticate later requests
    const response = await fetch(`${ENV.host}/login?accessToken=${accessToken}`, {
      mode: 'same-origin',
      credentials: 'include',
    });

    const body = response.json();

    if (!response.ok) throw await response.json();

    const displayName = `${(typeof NYCIDUser.givenName === 'undefined') ? '' : NYCIDUser.givenName} ${(typeof NYCIDUser.sn === 'undefined') ? '' : NYCIDUser.sn}`;

    try {
      // eslint-disable-next-line no-undef
      FS.identify(NYCIDUser.GUID, {
        displayName,
        email: mail,
        zapSearchHasLoggedIn: true,
      });
    } catch (e) {
      throw new InvalidError([{ detail: e, message: 'FS.identify failed.' }]);
    }

    return body;
  }
}
