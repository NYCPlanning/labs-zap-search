import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MyProjectsArchiveRoute extends Route {
  @service
  currentUser;

  @service
  store;

  async model() {
    // Use this endpoint for now. This will need to be updated when the backend is finalized.
    return this.store.query('project', { project_lup_status: 'archive' });
  }
}
