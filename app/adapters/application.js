import DS from 'ember-data';
import ENV from 'labs-zap-search/config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { inject as service } from '@ember/service';

const { JSONAPIAdapter } = DS;

export default class ApplicationAdapter extends JSONAPIAdapter.extend(DataAdapterMixin) {
  @service
  session

  host = ENV.host;

  authorize(xhr) {
    const { access_token } = this.get('session.data.authenticated');

    if (access_token) {
      xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
    }
  }
}
