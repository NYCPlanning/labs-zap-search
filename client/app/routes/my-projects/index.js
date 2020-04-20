import Route from '@ember/routing/route';

export default class MyProjectsIndexRoute extends Route {
  redirect() {
    this.transitionTo('my-projects.to-review');
  }
}
