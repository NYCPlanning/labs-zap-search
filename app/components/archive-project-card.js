import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default class ReviewedProjectCardComponent extends Component {
  @service
  milestoneConstants;

  assignment = {};
}
