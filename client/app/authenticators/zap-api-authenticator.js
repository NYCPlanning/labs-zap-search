import fetch from 'fetch';
import RSVP from 'rsvp';
import { isEmpty } from '@ember/utils';
import ENV from 'labs-zap-search/config/environment';
import { InvalidError } from '@ember-data/adapter/error';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

// NYC.ID Authorization Code + PKCE. The ZAP API exchanges the code with NYC.ID
// (NYC.ID requires a client secret, so the browser can't) and returns a ZAP token.
export default class ZAPAuthenticator extends BaseAuthenticator {
  // keep the user signed in across page reloads, as the implicit grant authenticator did
  restore(data) {
    if (isEmpty(data.access_token)) return RSVP.reject();

    return RSVP.resolve(data);
  }

  async authenticate({ code, codeVerifier, redirectUri }) {
    const params = new URLSearchParams({ code, codeVerifier, redirectUri });


    // returns an http cookie to implicitly authenticate later requests
    const response = await fetch(`${ENV.host}/login?${params}`, {
      mode: 'same-origin',
      credentials: 'include',
    });

    if (!response.ok) throw await response.json();

    const { access_token, nycid } = await response.json();

    const displayName = `${(typeof nycid.given_name === 'undefined') ? '' : nycid.given_name} ${(typeof nycid.family_name === 'undefined') ? '' : nycid.family_name}`;

    try {
      // eslint-disable-next-line no-undef
      FS.identify(nycid.GUID, {
        displayName,
        email: nycid.email,
        zapSearchHasLoggedIn: true,
      });
    } catch (e) {
      throw new InvalidError([{ detail: e, message: 'FS.identify failed.' }]);
    }

    return { access_token };
  }
}
