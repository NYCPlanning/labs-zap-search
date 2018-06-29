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
    displayName: 'City Planning Commission Review',
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
  tagName = 'li';
  classNameBindings = ['getClassNames'];

  @argument
  milestone

  @argument
  isFiled

  @computed('tense')
  get getClassNames() {
    const tense = this.get('tense');
    return `grid-x grid-padding-small milestone ${tense}`
  }

  // one of 'past', 'present', or 'future'
  @computed('milestoneDisplayDates')
  get tense() {

    const displayDates = this.get('milestoneDisplayDates');
    // if no display dates, return future
    if (!displayDates) return 'future';

    const [, firstDate, secondDate] = displayDates;

    // check if all dates are in the past
    const firstDatePast = moment(firstDate.date).isBefore();
    let secondDatePast = firstDatePast;
    if (secondDate) {
      secondDatePast = moment(secondDate.date).isBefore();
      if (firstDatePast && !secondDatePast) return 'present';
    }

    return (firstDatePast && secondDatePast) ? 'past' : 'future';
  }

  @computed('milestone.milestonename')
  get displayName() {
    const milestonename = this.get('milestone.milestonename');
    return milestoneLookup[milestonename].displayName;
  }

  // useful so handlebars knows whether to append "start" and "end" labels to dates
  @computed('milestonename')
  get isRange() {
    const milestonename = this.get('milestone.milestonename');
    return milestoneLookup[milestonename].dateFormat === 'range';
  }

  // Returns an array
  // first item in array is the offset string
  // subsquent items are time objects
  // Each object contains _actual_ (boolean) and _date_ (date)
  //
  // [
  //   {time offset string},
  //   {
  //     actual: true,
  //     date: date,
  //   },
  //   {
  //     actual: true,
  //     date: date,
  //   },
  // ]

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
          moment(actualStartDate).fromNow(),
          {
            actual: true,
            date: actualStartDate,
          },
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

        const offsetDate = moment(startDateObject.date).isAfter() ? startDateObject.date : endDateObject.date;
        let offsetString = moment(offsetDate).fromNow()
        // if now is within the range, manually set the offset string
        if (moment(startDateObject.date).isBefore() && moment(endDateObject.date).isAfter()) {
          offsetString = 'In Progress'
        }

        return [ offsetString, startDateObject, endDateObject];
    }

    // show end
    if (dateFormat === 'end' && (actualEndDate)) {
      const dateObject = {
        actual: true,
        date: actualEndDate,
      };

      return [
        moment(dateObject.date).fromNow(),
        dateObject,
      ]
    }
    return null;
  }
}
