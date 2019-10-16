import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class ReviewedProjectCardComponent extends Component {
  @service
  currentUser;

  assignment = {};

  @computed('assignment.reviewedMilestoneActualStartEndDates')
  get timeDisplays() {
    return this.assignment.reviewedMilestoneActualStartEndDates.map(startEndDate => ({
      displayName: startEndDate.displayName,
      timeRemaining: moment(startEndDate.dcpActualenddate).diff(moment().endOf('day'), 'days'),
      timeDuration: moment(startEndDate.dcpActualenddate).diff(moment(startEndDate.dcpActualstartdate), 'days'),
      dcpActualenddate: startEndDate.dcpActualenddate,
    }));
  }
}
