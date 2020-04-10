import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default class CurrentUserService extends Service {
  @service
  session;

  @service
  store;

  // If session is authenticated, uses the session's user id to
  // look up and return a PROMISE for the Ember Data Store's User object.
  @computed('session.{isAuthenticated,data.authenticated}')
  get user() {
    return this.store.peekRecord('user', this.session.data.authenticated.id);
  }

  @computed('session.isAuthenticated')
  get isLoggedIn() {
    return this.session.isAuthenticated;
  }
}
