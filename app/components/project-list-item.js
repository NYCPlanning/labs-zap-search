import Component from '@ember/component';
import { computed } from '@ember-decorators/object';

export default class ProjectListComponent extends Component {
  @computed('project.applicants')
  get firstApplicant() {
    const applicants = this.get('project.applicants');
    return applicants ? applicants.split(';')[0] : 'Unknown';
  }

  // @argument
  project = {};
}
