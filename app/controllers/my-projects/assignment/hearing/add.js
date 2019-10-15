import Controller from '@ember/controller';
import EmberObject, { action } from '@ember/object';

// object used for when allActions is true
// user has decided to submit one hearing for ALL actions
// the single date and single location values are set on this object
// then later the hearing location and date for EVERY disposition is set with these values
class DispositionForAllActions extends EmberObject {
  dcpPublichearinglocation = '';

  dcpDateofpublichearing = '';
}

export default class MyProjectsProjectHearingAddController extends Controller {
  // if there is a SINGLE hearing for ALL actions
  allActions = null;

  modalOpen = false;

  dispositionForAllActions = DispositionForAllActions.create();

  // passed down to date-time-picker and location-input components
  // set to true when the user clicks on Submit Hearing button
  // and "submitHearing" action sets it to true
  // checkIfMissing is for notifying the user which inputs are invalid
  checkIfMissing = false;

  // to check whether hearing model attributes "location" and "date" are populated
  // determines certain visual displays based on whether a hearing is submitted
  hearingSubmitted = false;

  // changes allActions to true or false based on a radio button selection
  @action
  setProp(property, newVal) {
    this.set(property, newVal);
  }

  @action
  closeModal() {
    this.set('modalOpen', false);
  }

  // checks that the user had input valid values
  // opens up the modal so the user can review their inputs
  @action
  onSubmit() {
    // set to true for a visual display of which inputs are invalid
    // passed down to date-time-picker and location-input components
    this.set('checkIfMissing', true);

    const { dispositions } = this.model.project;
    const dispositionForAllActions = this.get('dispositionForAllActions');

    let fieldsFilled;

    const allActions = this.get('allActions');

    // a function to check if each hearing location/date field is truthy
    function infoExists(hearingInfo) {
      return hearingInfo;
    }

    // if user is submitting ONE hearing for ALL actions
    if (allActions) {
      const allActionsDispHearingLocation = dispositionForAllActions.dcpPublichearinglocation;
      const allActionsDispHearingDate = dispositionForAllActions.dcpDateofpublichearing;
      fieldsFilled = allActionsDispHearingLocation && allActionsDispHearingDate;
    // if user is submitting a hearing PER action
    } else {
      const dispositionHearingLocations = dispositions.map(disp => `${disp.dcpPublichearinglocation}`);
      const dispositionHearingDates = dispositions.map(disp => disp.dcpDateofpublichearing);
      // using function infoExists, fieldsFilled checks whether each item in array is truthy
      fieldsFilled = dispositionHearingLocations.every(infoExists) && dispositionHearingDates.every(infoExists);
    }

    if (fieldsFilled) {
      this.set('modalOpen', true);
    }
  }

  // action triggered when click on the Confirm button in the modal
  // saves date and location to the disposition model
  @action
  async onConfirm() {
    const { dispositions } = this.model.project;
    const allActions = this.get('allActions');

    // if user is submitting ONE hearing for ALL actions
    if (allActions) {
      const allActionsDispHearingLocation = this.get('dispositionForAllActions.dcpPublichearinglocation');
      const allActionsDispHearingDate = this.get('dispositionForAllActions.dcpDateofpublichearing');

      // iterate through each disposition on the modal
      // set hearing location and date on each one with the single value that the user input
      // this single value is saved on dispositionForAllActions object
      dispositions.forEach(function(disposition) {
        disposition.set('dcpPublichearinglocation', allActionsDispHearingLocation);
        disposition.set('dcpDateofpublichearing', allActionsDispHearingDate);
      });
    }

    dispositions.save().then(() => {
      this.set('hearingSubmitted', false);
      this.set('checkIfMissing', false);
      this.set('modalOpen', false);
      this.transitionToRoute('my-projects.assignment.hearing.done');
    }, (e) => {
      this.set('error', e);
      console.log('server error', e);
    });
  }
}
