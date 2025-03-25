import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import ENV from 'labs-zap-search/config/environment';

export default class AdvisoryMessageBarComponent extends Component {
  @tracked
  showSandboxWarningOn = ENV.featureFlagShowSandboxWarning;

  @tracked
  message = '';
}
