import Component from '@ember/component';
// import { argument } from '@ember-decorators/argument';
import { computed } from '@ember-decorators/object';
import moment from 'moment';

const milestoneLookup = {
  'Borough Board Referral': {
    displayName: 'Borough Board Review',
    dateFormat: 'range',
    hideIfFiled: true,
    ulurptooltip: 'The Borough Board has 30 days concurrent with the Borough President’s review period to review the application and issue a recommendation.',
    nonulurptooltip: '',
  },
  'Borough President Referral': {
    displayName: 'Borough President Review',
    dateFormat: 'range',
    hideIfFiled: true,
    ulurptooltip: 'The Borough President has 30 days after the Community Board issues a recommendation to review the application and issue a recommendation.',
    nonulurptooltip: '',
  },
  'Prepare CEQR Fee Payment': {
    displayName: 'CEQR Fee Paid',
    dateFormat: 'end',
    hideIfFiled: false,
    ulurptooltip: '',
    nonulurptooltip: '',
  },
  'City Council Review': {
    displayName: 'City Council Review',
    dateFormat: 'range',
    hideIfFiled: true,
    ulurptooltip: 'The City Council has 50 days from receiving the City Planning Commission report to call up the application, hold a hearing and vote on the application.',
    nonulurptooltip: 'The City Council reviews text amendments and a few other non-ULURP items.',
  },
  'Community Board Referral': {
    displayName: 'Community Board Review',
    dateFormat: 'range',
    hideIfFiled: true,
    ulurptooltip: 'The Community Board has 60 days from the time of referral (nine days after certification) to hold a hearing and issue a recommendation.',
    nonulurptooltip: 'The City Planning Commission refers to the Community Board for 30, 45 or 60 days.',
  },
  'CPC Public Meeting - Public Hearing': {
    displayName: 'City Planning Commission Review',
    dateFormat: 'range',
    hideIfFiled: true,
    ulurptooltip: 'The City Planning Commission has 60 days after the Borough President issues a recommendation to hold a hearing and vote on an application.',
    nonulurptooltip: 'The City Planning Commission does not have a clock for non-ULURP items. It may or may not hold a hearing depending on the action.',
  },
  'CPC Public Meeting - Vote': {
    displayName: 'City Planning Commission Vote',
    dateFormat: 'end',
    hideIfFiled: true,
    ulurptooltip: '',
    nonulurptooltip: '',

  },
  'DEIS Public Hearing Held': {
    displayName: 'Draft Environmental Impact Statement Public Hearing',
    dateFormat: 'end',
    hideIfFiled: true,
    ulurptooltip: '',
    nonulurptooltip: '',
  },
  'Review Filed EAS and EIS Draft Scope of Work': {
    displayName: 'Draft Scope of Work for Environmental Impact Statement Received',
    dateFormat: 'start',
    hideIfFiled: true,
    ulurptooltip: 'A Draft Scope of Work must be recieved 30 days prior to the Public Scoping Meeting.',
    nonulurptooltip: 'A Draft Scope of Work must be recieved 30 days prior to the Public Scoping Meeting.',
  },
  'DEIS Public Scoping Meeting': {
    displayName: 'Environmental Impact Statement Public Scoping Meeting',
    dateFormat: 'end',
    hideIfFiled: true,
    ulurptooltip: '',
    nonulurptooltip: '',
  },
  'Prepare and Review FEIS': {
    displayName: 'Final Environmental Impact Statement Submitted',
    dateFormat: 'start',
    hideIfFiled: true,
    ulurptooltip: 'A Final Environmental Impact Statement (FEIS) must be completed ten days prior to the City Planning Commission vote.',
    nonulurptooltip: 'A Final Environmental Impact Statement (FEIS) must be completed ten days prior to the City Planning Commission vote.',
  },
  'Review Filed EAS': {
    displayName: 'Environmental Assessment Statement Filed',
    dateFormat: 'start',
    hideIfFiled: false,
    ulurptooltip: '',
    nonulurptooltip: '',
  },
  'Revised Filed EAS Review': {
    displayName: 'Revised Environmental Assessment Statement Filed',
    dateFormat: 'start',
    hideIfFiled: false,
    ulurptooltip: '',
    nonulurptooltip: '',
  },
  'Final Letter Sent': {
    displayName: 'Approval Letter Sent to Responsible Agency',
    dateFormat: 'end',
    hideIfFiled: true,
    ulurptooltip: '',
    nonulurptooltip: 'For many non-ULURP actions this is the final action and record of the decision.',
  },
  'Issue Final Scope of Work': {
    displayName: 'Final Scope of Work for Environmental Impact Statement Issued',
    dateFormat: 'end',
    hideIfFiled: true,
    ulurptooltip: '',
    nonulurptooltip: '',
  },
  'Prepare Filed Land Use Application': {
    displayName: 'Land Use Application Filed',
    dateFormat: 'end',
    hideIfFiled: false,
    ulurptooltip: '',
    nonulurptooltip: '',
  },

  // special handling for subsequent instances of Filing
  'Revised Land Use Application Filed Review': {
    displayName: 'Revised Land Use Application Filed',
    dateFormat: 'start',
    hideIfFiled: false,
    ulurptooltip: '',
    nonulurptooltip: '',
  },
  'Prepare Filed Land Use Fee Payment': {
    displayName: 'Land Use Fee Paid',
    dateFormat: 'end',
    hideIfFiled: false,
    ulurptooltip: '',
    nonulurptooltip: '',
  },
  'Mayoral Veto': {
    displayName: 'Mayoral Review',
    dateFormat: 'range',
    hideIfFiled: true,
    ulurptooltip: "The Mayor has five days to review the City Council's decision and issue a veto.",
    nonulurptooltip: '',
  },
  'DEIS Notice of Completion Issued': {
    displayName: 'Draft Environmental Impact Statement Completed',
    dateFormat: 'end',
    hideIfFiled: true,
    ulurptooltip: 'A Draft Environmental Impact Statement must be completed prior to the City Planning Commission certifying or referring a project for public review.',
    nonulurptooltip: 'A Draft Environmental Impact Statement must be completed prior to the City Planning Commission certifying or referring a project for public review.',
  },
  'Review Session - Certified / Referred': {
    displayName: 'Application Reviewed at City Planning Commission Review Session',
    dateFormat: 'end',
    hideIfFiled: true,
    ulurptooltip: 'A "Review Session" milestone signifies that the application has been sent to the City Planning Commission (CPC) and is ready for review. The "Review" milestone represents the period of time (up to 60 days) that the CPC reviews the application before their vote.',
    nonulurptooltip: 'A "Review Session" milestone signifies that the application has been sent to the City Planning Commission and is ready for review. The City Planning Commission does not have a clock for non-ULURP items. It may or may not hold a hearing depending on the action.',
  },
};

export default class ProjectMilestoneComponent extends Component {
  tagName = 'li';

  classNameBindings = ['getClassNames'];

  // @argument
  milestone;

  // @argument
  isFiled;

  // @argument
  isUlurp;

  @computed('tense')
  get getClassNames() {
    const { tense } = this;
    return `grid-x grid-padding-small milestone ${tense}`;
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

  @computed('milestone.milestonename')
  get tooltip() {
    const milestonename = this.get('milestone.milestonename');
    const nonulurptip = milestoneLookup[milestonename].nonulurptooltip;
    const ulurptip = milestoneLookup[milestonename].ulurptooltip;
    const { isUlurp } = this;

    if (isUlurp) {
      const tooltip = `${ulurptip}`;
      return tooltip;
    }
    const tooltip = `${nonulurptip}`;
    return tooltip;
  }

  @computed('milestonename')
  get milestoneDisplayDates() {
    const milestonename = this.get('milestone.milestonename');
    const { dateFormat, hideIfFiled } = milestoneLookup[milestonename];

    const { isFiled } = this;

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
      ];
    }

    // show range
    if (dateFormat === 'range' && actualStartDate) {
      const startDateObject = {
        actual: !!actualStartDate,
        date: actualStartDate || plannedStartDate,
      };

      const endDateObject = {
        actual: !!actualEndDate,
        date: actualEndDate || plannedEndDate,
      };

      const offsetDate = moment(startDateObject.date).isAfter() ? startDateObject.date : endDateObject.date;
      let offsetString = moment(offsetDate).fromNow();
      // if now is within the range, manually set the offset string
      if (moment(startDateObject.date).isBefore() && moment(endDateObject.date).isAfter()) {
        offsetString = 'In Progress';
      }

      return [offsetString, startDateObject, endDateObject];
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
      ];
    }
    return null;
  }
}
