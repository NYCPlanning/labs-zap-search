import Route from '@ember/routing/route';
import OAuth2ImplicitGrantCallbackRouteMixin from 'ember-simple-auth/mixins/oauth2-implicit-grant-callback-route-mixin';

export default class ApplicationRoute extends Route.extend(OAuth2ImplicitGrantCallbackRouteMixin) {
  authenticator = 'authenticator:oauth2-implicit-grant';

  beforeModel(transition) {
    // load the projects view by default
    if (transition.intent.url === '/') {
      this.transitionTo('show-geography');
    }
  }
}
