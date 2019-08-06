import Controller from '@ember/controller';
import { computed } from '@ember-decorators/object';
import { inject as service } from '@ember-decorators/service';

export default class MyProjectsController extends Controller {
  @service router;

  @computed('router.currentRouteName')
  get activeTab() {
    const route = this.get('router.currentRouteName').split('.')[1];
    return route;
  }
}
