import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MyProjectsController extends Controller {
  @service router;

  @computed('router.currentRouteName')
  get activeTab() {
    const route = this.get('router.currentRouteName').split('.')[1];
    return route;
  }

  @computed('router.currentRouteName')
  get isInSubroute() {
    const route = this.get('router.currentRouteName').split('.')[1];
    return route === 'assignment';
  }
}
