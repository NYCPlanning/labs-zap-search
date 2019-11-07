import Component from '@ember/component';
import { computed } from '@ember/object';

export default class RecommendationSymbol extends Component {
  // Enum
  participantRecommendation = null;

  @computed('participantRecommendation')
  get icon() {
    let icon = { style: '', color: 'light-gray' };
    if ([717170000, 717170001].includes(this.participantRecommendation)) {
      icon = { style: 'thumbs-up', color: 'green-muted' };
    } else if ([717170002, 717170003].includes(this.participantRecommendation)) {
      icon = { style: 'thumbs-down', color: 'red-muted' };
    } else if ([717170002, 717170006, 717170008].includes(this.participantRecommendation)) {
      icon = { style: 'comment-slash', color: 'light-gray' };
    }
    return icon;
  }
}
