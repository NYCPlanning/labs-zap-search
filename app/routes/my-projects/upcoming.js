import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MyProjectsUpcomingRoute extends Route {
  @service
  currentUser;

  @service
  store;

  // This route loads the user's projects according to their milestones and associated userProjectParticipantTypes.
  // Specifically, a given user's project only shows up here if...
  // 1) it has an "Review" (a.k.a. "Referral") milestone that has a statuscode of "Not Started"
  // 2) it matches one of the project's -- and the current user's -- associated userProjectParticipantTypes
  // For example, for a Borough President user, a project shows up here if it has an "Not Started" Borough President Referral milestone.
  async model() {
    // Use this endpoint for now. This will need to be updated when the backend is finalized.
    return this.store.query('project', { project_lup_status: 'upcoming' });
  }
}
