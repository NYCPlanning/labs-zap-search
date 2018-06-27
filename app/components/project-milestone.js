import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { computed } from '@ember-decorators/object';
import moment from 'moment';

const milestoneLookup = {
  'Borough Board Referral': {
    displayName: 'Borough Board Review',
    dateFormat: 'range',
    hideIfFiled: true,
  },
  'Borough President Referral': {
    displayName: 'Borough President Review',
    dateFormat: 'range',
    hideIfFiled: true,
  },
  'CEQR Fee Payment': {
    displayName: 'CEQR Fee Paid',
    dateFormat: 'end',
    hideIfFiled: false,
  },
  'City Council Review': {
    displayName: 'City Council Review',
    dateFormat: 'range',
    hideIfFiled: true,
  },
  'Community Board Referral': {
    displayName: 'Community Board Review',
    dateFormat: 'range',
    hideIfFiled: true,
  },
  'CPC Public Meeting - Public Hearing': {
    displayName: 'City Planning Commission Review / Public Hearing',
    dateFormat: 'range',
    hideIfFiled: true,
  },
  'CPC Public Meeting - Vote': {
    displayName: 'City Planning Commission Vote',
    dateFormat: 'end',
    hideIfFiled: true,
  },
  'DEIS Public Hearing Held': {
    displayName: 'Draft Environmental Impact Statement Public Hearing',
    dateFormat: 'end',
    hideIfFiled: true,
  },
  'EIS Draft Scope Review': {
    displayName: 'Draft Scope of Work for EIS Received',
    dateFormat: 'start',
    hideIfFiled: true,
  },
  'EIS Public Scoping Meeting': {
    displayName: 'Environmental Impact Statement Public Scoping Meeting',
    dateFormat: 'end',
    hideIfFiled: true,
  },
  'FEIS Submitted and Review': {
    displayName: 'Final Environmental Impact Statement Submitted',
    dateFormat: 'start',
    hideIfFiled: true,
  },
  'Filed EAS Review': {
    displayName: 'Environmental Assessment Statement Filed',
    dateFormat: 'start',
    hideIfFiled: false,
  },
  'Final Letter Sent': {
    displayName: 'Approval Letter Sent to Responsible Agency',
    dateFormat: 'end',
    hideIfFiled: true,
  },
  'Final Scope of Work Issued': {
    displayName: 'Final Scope of Work for Environmental Impact Statement Issued',
    dateFormat: 'end',
    hideIfFiled: true,
  },
  'Land Use Application Filed Review': {
    displayName: 'Land Use Application Filed',
    dateFormat: 'start',
    hideIfFiled: false,
  },
  'Land Use Fee Payment': {
    displayName: 'Land Use Fee Paid',
    dateFormat: 'end',
    hideIfFiled: false,
  },
  'Mayoral Veto': {
    displayName: 'Mayoral Review',
    dateFormat: 'range',
    hideIfFiled: true,
  },
  'NOC of Draft EIS Issued': {
    displayName: 'Draft Environmental Impact Statement Completed',
    dateFormat: 'end',
    hideIfFiled: true,
  },
  'Review Session - Certified / Referred': {
    displayName: 'Application Certified / Referred at City Planning Commission Review Session',
    dateFormat: 'end',
    hideIfFiled: true,
  }
}


export default class ProjectMilestoneComponent extends Component {
  @argument
  milestone

  @argument
  isFiled

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

  // Returns an array of  2 or fewer
  // Each object contains _actual_ (boolean) and _date_ (date)
  //
  // [
  //   {
  //     actual: true,
  //     date: date,
  //   },
  //   {
  //     actual: true,
  //     date: date,
  //   },
  // ]

  // 'Borough Board Referral' - range
  // 'Borough President Referral' - range
  // 'CEQR Fee Payment' - date
  // 'City Council Review' - range
  // 'Community Board Referral' - range
  // 'CPC Public Meeting - Public Hearing' - range
  // 'CPC Public Meeting - Vote' - date
  // 'DEIS Public Hearing Held' - date
  // 'EIS Draft Scope Review' - start
  // 'EIS Public Scoping Meeting' - date
  // 'FEIS Submitted and Review' - start
  // 'Filed EAS Review' - start
  // 'Final Letter Sent' - date
  // 'Final Scope of Work Issued' - date
  // 'Land Use Application Filed Review' - start
  // 'Land Use Fee Payment' - date
  // 'Mayoral Veto' - range
  // 'NOC of Draft EIS Issued' - date
  // 'Review Session - Certified / Referred' - date

  // useful so handlebars knows whether to append "start" and "end" labels to dates
  @computed('milestonename')
  get isRange() {
    const milestonename = this.get('milestone.milestonename');
    return milestoneLookup[milestonename].dateFormat === 'range';
  }

  @computed('milestonename')
  get milestoneDisplayDates() {
    const milestonename = this.get('milestone.milestonename');
    const { dateFormat, hideIfFiled } = milestoneLookup[milestonename];

    const isFiled = this.get('isFiled');

    const plannedStartDate = this.get('milestone.dcp_plannedstartdate');
    const plannedEndDate = this.get('milestone.dcp_plannedcompletiondate');
    const actualStartDate = this.get('milestone.dcp_actualstartdate');
    const actualEndDate = this.get('milestone.dcp_actualenddate');

    // return null if current project isFiled and this milestone has showIfFiled = false
    if (isFiled && hideIfFiled) return null;

    // only show actualstart date
    if (dateFormat === 'start' && actualStartDate) {
        return [
          {
            actual: true,
            date: actualStartDate,
          }
        ]
    }

    // show range
    if (dateFormat === 'range' && actualStartDate) {
        const startDateObject = {
          actual: actualStartDate ? true : false,
          date: actualStartDate ? actualStartDate : plannedStartDate,
        };

        const endDateObject = {
          actual: actualEndDate ? true : false,
          date: actualEndDate ? actualEndDate : plannedEndDate,
        }

        return [ startDateObject, endDateObject ];
    }

    // show end
    if (dateFormat === 'end' && (plannedEndDate || actualEndDate)) {
      return [
        {
          actual: actualEndDate ? true : false,
          date: actualEndDate ? actualEndDate : plannedEndDate,
        }
      ]
    }
    return null;
  }
}
