import DS from 'ember-data';
import ENV from 'labs-zap-search/config/environment';

const { JSONAPIAdapter } = DS;

export default class ApplicationAdapter extends JSONAPIAdapter {
  host = ENV.host;

  ajax(url, method, hash = {}) {
    hash.xhrFields = { withCredentials: true };

    return super.ajax(url, method, hash);
  }
}
