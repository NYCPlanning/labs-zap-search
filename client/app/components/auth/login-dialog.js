import Component from '@ember/component';
import ENV from 'labs-zap-search/config/environment';

export default Component.extend({
  oauthEndpoint: ENV.OAUTH_ENDPOINT,
});
