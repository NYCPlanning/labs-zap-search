import Component from '@ember/component';
import { computed } from '@ember/object';

export default class ProjectListComponent extends Component {
  @computed('project.applicants')
  get firstApplicant() {
    const applicants = this.get('project.applicants');
    return applicants ? applicants.split(';')[0] : 'Unknown';
  }

  @computed('project.{dcpCeqrtype,dcpCeqrnumber}')
  get ceqrUnlistedNull() {
    const unlistedOrNullCeqr = this.get('project.dcpCeqrtype') === 'Unlisted' || this.get('project.dcpCeqrtype') === null;
    const nullCeqrNumber = this.get('project.dcpCeqrnumber') === null;
    return unlistedOrNullCeqr && nullCeqrNumber;
  }

  // @argument
  project = {};
}
