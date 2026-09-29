import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import ENV from 'labs-zap-search/config/environment';

export default class ApplicationController extends Controller {
  @service router;

  @tracked
  showSandboxWarningOn = ENV.featureFlagShowSandboxWarning;

  @tracked
  message = '';

  get currentRouteName() {
    return this.router.currentRouteName;
  }
}
