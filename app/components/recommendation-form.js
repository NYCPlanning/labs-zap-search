import Component from '@ember/component';
import EmberObject, { action } from '@ember/object';

export default class recommendationFormComponent extends Component {
  participantType = null;
  hearingdate = null;
  hearinglocation = null;
  didQuorumExist = null;
  dateVoted = null;
  voteLocation = null;

  @action
  setRecVoteLocation(location) {
    this.recommendation.set('voteLocation', location.label);
  }

  @action
  clearRecVoteLocation() {
    this.recommendation.set('voteLocation', '');
  }
}
