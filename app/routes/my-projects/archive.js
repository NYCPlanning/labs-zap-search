import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MyProjectsArchiveRoute extends Route {
  @service
  currentUser;

  @service
  store;

  async model() {
    // Use this endpoint for now. This will need to be updated when the backend is finalized.
    return this.store.query('assignment', {
      tab: 'archive',
      include: 'project.milestones,project.dispositions,project.actions',
    }, {
      reload: true,
    });
    return archiveProjects;
  }
}
