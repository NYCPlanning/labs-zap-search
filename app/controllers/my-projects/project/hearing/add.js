import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

// create a hearing record when a user clicks on the submit hearing button
function createHearing(thisHearing, hearingLocation, hearingDate) {
  const newHearing = thisHearing.store.createRecord('hearing', {
    project: thisHearing.model,
    location: hearingLocation,
    date: hearingDate,
  });
  newHearing.save();
}

export default class MyProjectsProjectHearingAddController extends Controller {
  @service
  store;

  // for checking if user clicks submit button without inputting necessary attributes
  dateMissing=null;

  timeMissing=null;

  locationMissing=null;

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

  // when a user clicks on the x in the input box for geosearch
  @action
  clearSearchResult() {
    this.onClearSearchResult();
  }

  // action triggered when click on "submit hearing" button
  @action
  async saveHearingForm() {
    // arguments to trigger a notification to the user that they need to input a field
    this.set('dateMissing', !this.date);
    this.set('locationMissing', !this.location);
    this.set('timeMissing', !this.time);

    // dateUpdated = this.date + minutes & hours from this.time
    const minutesAdded = moment(this.time).minute();
    const hoursAdded = moment(this.time).hour();
    const dateUpdated = moment(this.date).add(hoursAdded, 'h').add(minutesAdded, 'm').toDate();

    // allows users to add additional location info, updates location string
    let locationUpdated = '';

    if (this.location && this.additionalLocationInfo) {
      // locations come back as an object with geometry and bbl so
      // we need to grab location.label to get address string
      const locationLabel = this.location.label;
      locationUpdated = locationLabel.concat('; ', this.additionalLocationInfo);
    } else if (this.location) {
      locationUpdated = this.location.label;
    }

    // if user has input date, location, and time then save to model and transition to to-review route
    if (this.date && this.location && this.time) {
      try {
        await createHearing(this, locationUpdated, dateUpdated);
        this.transitionToRoute('/my-projects/to-review');
      } catch (e) {
        alert('Sorry about that, unable to connect to server, can you try again?'); // eslint-disable-line
      }
    }
  }
}
