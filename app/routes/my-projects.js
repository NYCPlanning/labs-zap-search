import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const AuthenticatedRoute = Route.extend(AuthenticatedRouteMixin);

export default class MyProjectsRoute extends AuthenticatedRoute {
}
