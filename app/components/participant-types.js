import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

// This component yields a list of participantTypes codes for a given
// User and Project. Generally, only Borough Presidents will have multiple (two)
// UserProjectParticipantTypes: BP and BB.
export default class ParticipantTypesComponent extends Component {
  @service
  store;

  user = {};

  project = {};

  @computed('user', 'project')
  get userProjectParticipantTypes() {
    if (this.user && this.project) {
      let filteredPartTypes = this.user.get('userProjectParticipantTypes').filterBy('project.id', this.project.get('id'));
      let partTypesList = filteredPartTypes.map(value => value.get('participantType'));
      return partTypesList;
    };
    return [];
  }
}
