import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MyProjectsToReviewRoute extends Route {
  @service
  currentUser;

  @service
  store;

  async model() {
    // TODO: Retrieve projects here, instead of side-loading in currentUser service.
    // TODO: Filter user projects down to to-review projects here.
    let userProjects = await this.currentUser.get('user').then((user)=> {
      return user.get('projects');
    });
    return userProjects;
  }

}
