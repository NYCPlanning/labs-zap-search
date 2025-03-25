import DS from 'ember-data';
import ENV from 'labs-zap-search/config/environment';
import { inject as service } from '@ember/service';

const { JSONAPIAdapter } = DS;

export default class ApplicationAdapter extends JSONAPIAdapter {
  host = ENV.host;

  @service
  session;

  get headers() {
    if (this.session.isAuthenticated) {
      return {
        Authorization: `Bearer ${this.session.data.authenticated.access_token}`,
      };
    }

    return {};
  }
}
