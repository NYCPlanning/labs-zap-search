import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LoginRoute extends Route {
  @service
  session

  // hit /login in backend
  beforeModel() {
    // try to authenticate with the url#access_token
    // & with the zap api CRM-authenticated
    return this.session.authenticate('authenticator:zap-api-authenticator');
  }

  afterModel() {
    this.transitionTo('my-projects.to-review');
  }
}
