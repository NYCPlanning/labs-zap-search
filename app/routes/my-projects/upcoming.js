import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MyProjectsUpcomingRoute extends Route {
  @service
  currentUser;

  @service
  store;

  // This route loads the user's projects according to their milestones and associated userProjectParticipantTypes.
  // Specifically, a given user's project only shows up here if it has an active "Review" (a.k.a. "Referral") milestone
  // that matches one of the project's -- and the current user's -- associated userProjectParticipantTypes.
  // For example, for a Borough President user, a project shows up here if it has an active Borough President Referral milestone.
  async model() {
    // Use this endpoint for now. This will need to be updated when the backend is finalized.
    const user = await this.currentUser.get('user');
    const toReviewProjectsRaw = await fetch(`/users/${user.id}/projects?projectState=upcoming`);
    const toReviewProjectsIds = await toReviewProjectsRaw.json();
    return this.store.findAll('project', { ids: toReviewProjectsIds });
  }
}
