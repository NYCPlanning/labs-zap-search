import Component from '@ember/component';
import { action } from '@ember/object';

export default class LocationInputComponent extends Component {
  // arguments to check if the user has input a location value
  locationMissing = true;

  // targetField is set on the form render
  // represents the attribute that is to be set to the new value
  // e.g. disposition.dateofpublichearing
  targetField = '';

  // local attributes saved on every key-down event
  // "setHearingLocation" runs on every key-up event
  @action
  setLocation() {
    // for checking whether the user has entered text for a location
    // for displaying invalid inputs, the argument checkIfMissing is passed down
    // from the template for the route, add.hbs
    // checkIfMissing is set to true every time the "submitHearing" runs
    // e.g. {{#if (and locationMissing checkIfMissing)}}
    this.set('locationMissing', !this.location);

    // targetField is set when component is rendered
    // target attribute to be changed
    // e.g. disposition.publichearinglocation
    this.set('targetField', this.location);
  }
}
