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
      const filteredPartTypes = this.user.projects
        .map(project => project.userProjectParticipantTypes)
        .reduce((acc, curr) => [...acc, ...curr], []);
        // // TODO: filter later
        // .filterBy('project.id', this.project.get('id'));

      return filteredPartTypes.map(value => value.participantType);
    }
    return [];
  }
}
