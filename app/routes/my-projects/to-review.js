import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MyProjectsToReviewRoute extends Route {
  @service
  currentUser;

  @service
  store;

  // This route loads the user's projects according to their milestones and associated userProjectParticipantTypes.
  // Specifically, a given user's project only shows up here if...
  // 1) it has an "Review" (a.k.a. "Referral") milestone that has a statuscode of "In Progress"
  // 2) it matches one of the project's -- and the current user's -- associated userProjectParticipantTypes
  // For example, for a Borough President user, a project shows up here if it has an "In Progress" Borough President Referral milestone.
  async model() {
    // Use this endpoint for now. This will need to be updated when the backend is finalized.
    const user = await this.currentUser.get('user');
    const toReviewProjectsRaw = await fetch(`/users/${user.id}/projects?projectState=to-review`);
    const toReviewProjectsIds = await toReviewProjectsRaw.json();
    const filteredProjects = user.projects.filter(function(proj) {
      if (toReviewProjectsIds.includes(proj.id)) {
        return true;
      }
      return false;
    });
    return filteredProjects;
  }
}
