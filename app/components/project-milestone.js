import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { computed } from '@ember-decorators/object';
import moment from 'moment';


export default class ProjectMilestoneComponent extends Component {
  @argument
  milestone

  @computed('milestone.{dcp_plannedstartdate,dcp_actualstartdate}')
  get startDate() {
    const plannedStartDate = this.get('milestone.dcp_plannedstartdate');
    const actualStartDate = this.get('milestone.dcp_actualstartdate');

    if (actualStartDate) return actualStartDate;

    return plannedStartDate;
  }

  @computed('milestone.{dcp_plannedstartdate,dcp_actualstartdate,dcp_plannedcompletiondate,dcp_actualenddate}')
  get noDates() {
    const plannedStartDate = this.get('milestone.dcp_plannedstartdate');
    const plannedEndDate = this.get('milestone.dcp_plannedcompletiondate');

    const hasPlannedDates = !!plannedStartDate && !!plannedEndDate;

    const actualStartDate = this.get('milestone.dcp_actualstartdate');
    const actualEndDate = this.get('milestone.dcp_actualenddate');

    const hasActualDates = !!actualStartDate && !!actualEndDate;

    // return true if there are no dates
    return (!hasPlannedDates && !hasActualDates)
  }

  @computed('milestone.{dcp_plannedcompletiondate,dcp_actualenddate}')
  get endDate() {
    const plannedEndDate = this.get('milestone.dcp_plannedcompletiondate');
    const actualEndDate = this.get('milestone.dcp_actualenddate');

    if (actualEndDate) return actualEndDate;

    return plannedEndDate;
  }

  // either actualstart or actualend is null
  @computed('milestone.{dcp_actualstartdate,milestone.dcp_actualenddate}')
  get isPlanned() {
    const actualStartDate = this.get('milestone.dcp_actualstartdate');
    const actualEndDate = this.get('milestone.dcp_actualenddate');

    return actualStartDate === null && actualEndDate === null;
  }

  @computed('startDate','endDate')
  get startAndEndAreSameDay() {
    const start = this.get('startDate');
    const end = this.get('endDate');

    return moment(start).format('YYYMMDD') === moment(end).format('YYYMMDD');
  }

  @computed('startDate', 'endDate')
  get timeOffset() {

    const startDate = this.get('startDate');
    const endDate = this.get('endDate');

    // if startDate is in the future, use startDate
    if (moment(startDate).isAfter()) {
      return moment(startDate).fromNow();
    }
    // otherwise use endDate
    return moment(endDate).fromNow();

  }
}
