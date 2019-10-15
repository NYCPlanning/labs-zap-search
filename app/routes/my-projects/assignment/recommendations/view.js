import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MyProjectsProjectRecommendationsViewRoute extends Route {
  // Depends on the my-project/project route already loading a project
  // with side-loaded actions

  @service
  store;

  @service
  currentUser;

  model() {
    return this.modelFor('my-projects.project');
  }
}
