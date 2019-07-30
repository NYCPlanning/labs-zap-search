import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

// This component yields the necessary Recommendation objects for the given
// User and Project. Generally, only Borough Presidents with multiple
// UserProjectParticipantTypes for a project will have two Recommendations
// Glue template inputs to the yielded recommendations to update them before saving.
export default class ProjectRecommendationsComponent extends Component {
  @service
  store;

  user = {};

  project = {};

  @computed('user', 'project')
  get userProjectParticipantTypes() {
    if (this.user && this.project) {
      const userProjectParticipantTypes = this.user.get('userProjectParticipantTypes').filterBy('project.id', this.project.get('id'));
      return userProjectParticipantTypes.map(value => value.get('participantType'));
    }
    return [];
  }

  // The Recommendation type to create depends on UserProjectParticipantType.participantType
  @computed('userProjectParticipantTypes')
  get recommendations() {
    return this.userProjectParticipantTypes.map((userParticipantType) => {
      if (userParticipantType === 'BP') {
        return this.store.createRecord('borough-president-recommendation', {
          user: this.user,
        });
      }
      if (userParticipantType === 'BB') {
        return this.store.createRecord('borough-board-recommendation', {
          user: this.user,
        });
      }
      // if userParticipantType == 'CB'
      return this.store.createRecord('community-board-recommendation', {
        user: this.user,
      });
    });
  }
}
