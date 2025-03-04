import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import ENV from 'labs-zap-search/config/environment';

export default class ApplicationController extends Controller {
  @tracked
  showSandboxWarningOn = ENV.featureFlagShowSandboxWarning;

  @tracked
  message = '';
}
