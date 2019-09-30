import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { hearingsSubmitted } from 'labs-zap-search/helpers/hearings-submitted';

export default class ToReviewProjectCardComponent extends Component {
  @service
  currentUser;

  // hearingsSubmitted is a helper that iterates through each disposition
  // and checks whether disposition has publichearinglocation and dateofpublichearing
  @computed('project')
  get hearingsSubmittedForProject() {
    const dispositions = this.get('project.dispositions');
    return hearingsSubmitted(dispositions);
  }
}
