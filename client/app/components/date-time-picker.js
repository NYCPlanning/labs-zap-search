import Component from '@ember/component';
import { action, computed } from '@ember/object';
import moment from 'moment';

export default class DateTimePickerComponent extends Component {
  // arguments to check if the user has input date, hour, minute, and timeOfDay (AM/PM)

  // targetField is set on the form render
  // represents the attribute that is to be set to the new value
  // e.g. disposition.dcpDateofpublichearing
  targetField = '';

  // the options for the AM/PM power-select
  @computed()
  get timeOfDayOption() {
    const timeOfDayOption = ['AM', 'PM'];
    return timeOfDayOption;
  }

  // checks if the hour number input is between 1 and 12
  @computed('hour')
  get hourWithinRange() {
    const hourWithinRange = this.hour <= 12 && this.hour > 0;
    return !!hourWithinRange;
  }

  // checks if the minute number input is between 0 and 59
  @computed('minute')
  get minuteWithinRange() {
    const minuteWithinRange = this.minute <= 59 && this.minute >= 0;
    return !!minuteWithinRange;
  }

  // checks that hour, minute, timeOfDay all EXIST, and that hour & minute are within range
  @computed('hour', 'minute', 'timeOfDay', 'hourWithinRange', 'minuteWithinRange')
  get timeValid() {
    const timeValid = this.hour && this.minute && this.timeOfDay && this.hourWithinRange && this.minuteWithinRange;
    return timeValid;
  }

  // dateMissing, hourMissing, minuteMissing, and timeOfDayMissing
  // for checking whether the user has entered each required input
  // for displaying invalid inputs, the argument checkIfMissing is passed down
  // from the template for the route, add.hbs
  // checkIfMissing is set to true every time the "submitHearing" runs
  // e.g. {{#if (and hourMissing checkIfMissing)}}
  @computed('date')
  get dateMissing() {
    const dateMissing = !this.date;
    return dateMissing;
  }

  @computed('hour', 'hourWithinRange')
  get hourMissing() {
    let hourMissing = true;
    if (this.hourWithinRange) {
      hourMissing = !this.hour;
    } else {
      hourMissing = true;
    }
    return hourMissing;
  }

  @computed('minute', 'minuteWithinRange')
  get minuteMissing() {
    const minuteWithinRange = this.get('minuteWithinRange');
    let minuteMissing = true;
    if (minuteWithinRange) {
      minuteMissing = !this.minute;
    } else {
      minuteMissing = true;
    }
    return minuteMissing;
  }

  @computed('timeOfDay')
  get timeOfDayMissing() {
    const timeOfDayMissing = !this.timeOfDay;
    return timeOfDayMissing;
  }

  // concatenates the time and the date values
  @computed('date', 'hour', 'minute', 'timeOfDay', 'hourValid', 'timeValid')
  get hearingDateTime() {
    let hearingDateTime;

    if (this.date && this.timeValid) {
      let numberHour;

      if (this.timeOfDay === 'PM') {
        const pmHour = parseInt(this.hour, 10) === 12 ? 12 : parseInt(this.hour, 10) + 12;
        numberHour = pmHour;
      } else {
        numberHour = this.hour;
      }

      const numberMinute = parseInt(this.minute, 10);

      // create a new date with numberHour and numberMinute
      // converts hours and minutes to date objects rather than integers
      const hearingTime = new Date(0, 0, 0, numberHour, numberMinute);

      // grab the minute and hour from our hearingTime object using moment.js
      const hearingMinute = moment(hearingTime).minute();
      const hearingHour = moment(hearingTime).hour();

      hearingDateTime = moment(this.date).add(hearingHour, 'h').add(hearingMinute, 'm').toDate();
    }

    return hearingDateTime;
  }

  // "setHearingDate" runs every time that a user inputs date, hour, minute, or timeOfDay
  // local attributes are saved to create one date objet that is then saved to the model
  @action
  setHearingDate() {
    const { hearingDateTime } = this;

    const timeValid = this.hour && this.minute && this.timeOfDay && this.hourWithinRange && this.minuteWithinRange;
    const fullDateTimeValid = this.date && timeValid;

    // set includeTimeInput when form renders
    const includeTimeInput = this.get('includeTimeInput');

    if (includeTimeInput && fullDateTimeValid) {
      this.set('targetField', hearingDateTime);
    } else if (includeTimeInput && !fullDateTimeValid) {
      // if a user has not input one of the 4 inputs required for time & date,
      // or if a user has deleted one of these input values,
      // the full date value should be set back to NULL
      this.set('targetField', null);
    } else if (!includeTimeInput && this.date) {
      // only include this.date
      const hearingDate = this.date;
      this.set('targetField', hearingDate);
    }
  }
}
