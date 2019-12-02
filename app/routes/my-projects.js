import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const AuthenticatedRoute = Route.extend(AuthenticatedRouteMixin);

export default class MyProjectsRoute extends AuthenticatedRoute {
  // async model() {
  //   return this.store.query('assignment', {
  //     tab: 'to-review',
  //     include: 'project.milestones,project.dispositions,project.actions',
  //   }, {
  //     reload: false,
  //   });
  // }
}
