import Component from '@ember/component';
import ENV from 'labs-zap-search/config/environment';

const ACTION_STATUSCODE_ACTIVE = 1;

export default class ActionsListComponent extends Component {
  host = ENV.host;

  actionStatuscodeActive = ACTION_STATUSCODE_ACTIVE;
}
