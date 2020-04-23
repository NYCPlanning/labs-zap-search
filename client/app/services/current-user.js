import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default class CurrentUserService extends Service {
  @service
  session;

  @service
  store;

  // If session is authenticated, uses the session's user id to
  // peek the local store to return that user record
  @computed('session.{isAuthenticated,data.authenticated}')
  get user() {
    if (this.isLoggedIn) {
      return this.store.peekRecord('user', this.session.data.authenticated.id);
    }

    return {};
  }

  @computed('session.isAuthenticated')
  get isLoggedIn() {
    return this.session.isAuthenticated;
  }
}
