import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LoginRoute extends Route {
  @service
  session

  // NYC.ID redirects back here with ?code=... after sign-in (see auth/login-dialog signIn)
  async beforeModel() {
    const code = new URLSearchParams(window.location.search).get('code');
    const { codeVerifier } = this.session.data;

    // the verifier is single use
    this.session.set('data.codeVerifier', codeVerifier);
    // exchange the code for a ZAP token via the zap api (CRM-authenticated)
    await this.session.authenticate('authenticator:zap-api-authenticator', {
      code,
      codeVerifier,
      redirectUri: `${window.location.origin}/login`,
    });

    await this.store.queryRecord('user', { me: true });
  }

  afterModel() {
    this.transitionTo('my-projects.to-review');
  }
}
