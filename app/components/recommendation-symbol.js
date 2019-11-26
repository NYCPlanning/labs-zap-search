import Component from '@ember/component';
import { computed } from '@ember/object';

export default class RecommendationSymbol extends Component {
  // Enum
  participantRecommendation = null;

  @computed('participantRecommendation')
  get icon() {
    let icon = { style: '', color: 'light-gray' };
    if (['Favorable', 'Conditional Favorable', 'Approved', 'Approved with Modifications/Conditions', 'No Objection'].includes(this.participantRecommendation)) {
      icon = { style: 'thumbs-up', color: 'green-muted' };
    } else if (['Unfavorable', 'Conditional Unfavorable', 'Disapproved', 'Disapproved with Modifications/Conditions'].includes(this.participantRecommendation)) {
      icon = { style: 'thumbs-down', color: 'red-muted' };
    } else if (['Waiver of Recommendation', 'Received after Clock Expried', 'Vote Quorum Not Present', 'Non-Complying'].includes(this.participantRecommendation)) {
      icon = { style: 'comment-slash', color: 'light-gray' };
    }
    return icon;
  }
}
