import Component from '@ember/component';
import { action, computed } from '@ember/object';
import moment from 'moment';

export default class HearingFormComponent extends Component {
  // for checking if user clicks submit button without inputting necessary attributes
  dateMissing = null;

  timeMissing = null;

  locationMissing = null;

  // to check whether hearing model attributes "location" and "date" are populated
  hearingSubmitted = null;

  // minimum date for calendar
  currentDate = new Date();

  // for clearing search results on the geosearch input
  onClearSearchResult = () => {};

  @computed()
  get inputTimesArray() {
    // times will be an array with ALL 24 hours of the day, intervals of 5 minutes
    const times = [];
    // inputTimes will be an array with hours 6am-11pm, intervals of 5 minutes
    const inputTimes = [];

    // push new items into times array
    new Array(24).fill().forEach((acc, index) => {
      times.push(moment({ hour: index }));
      // intervals of 5 minutes
      const minutes = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
      minutes.forEach(function(m) {
        times.push(moment({ hour: index, minute: m }));
      });
    });

    // grab only hours between 6am and 11pm to push into inputTimes array
    times.forEach(function(t) {
      if (moment(t).hour() > 5 && moment(t).hour() < 23) {
        inputTimes.push(t);
      }
    });

    return inputTimes;
  }

  @action
  setHearingDate() {
    // dateUpdated is this.date + minutes & hours from this.time
    const minutesAdded = moment(this.time).minute();
    const hoursAdded = moment(this.time).hour();
    if (this.date && this.time) {
      const dateUpdated = moment(this.date).add(hoursAdded, 'h').add(minutesAdded, 'm').toDate();
      this.set('project.hearing.date', dateUpdated);
    }
  }

  // when a user clicks on the x in the input box for geosearch
  @action
  clearSearchResult() {
    this.onClearSearchResult();
  }

  // action triggered when click on "submit hearing" button
  @action
  async submitHearing(project) {
    // arguments to trigger a notification to the user that they need to input a field
    this.set('dateMissing', !this.date);
    this.set('locationMissing', !project.hearing.get('location'));
    this.set('timeMissing', !this.time);

    // if user has input date, location, and time then save these to model and transition to to-review route
    if (project.hearing.get('date') && project.hearing.get('location')) {
      try {
        await project.save();
        this.set('hearingSubmitted', true);
      } catch (e) {
        alert('Sorry about that, unable to connect to server, can you try again?'); // eslint-disable-line
      }
    }
  }
}
