import Component from '@ember/component';
import { computed, action } from '@ember/object';

export default class CityRecordFormComponent extends Component {
  // yes/no question that will display checkboxes for accessibility options
  hasAccessibilityOptions = null;

  // Set to true when a user clicks on the send button.
  // checkIfMissing === true will display that user has not filled in
  // certain required inputs
  checkIfMissing = false;

  // requester information
  requesterFullName = '';

  requesterPhoneNumber = '';

  requesterEmail = '';

  // accessibility options checkboxes
  wheelchairAccessible = 'no';

  assistiveListeningEar = 'no';

  blindOrLowVisionAccessible = 'no';

  largePrint = 'no';

  audioDescriptionForTvFilm = 'no';

  universalInformation = 'no';

  telephoneTypewriter = 'no';

  hearingWithTCoil = 'no';

  assistiveListeningTelephone = 'no';

  closeCaptioning = 'no';

  signLanguageInterpretation = 'no';

  braille = 'no';

  openCaptioning = 'no';

  communicationAccessRealTimeTranslation = 'no';

  // accessibility contact information
  accessibilityContactFullName = '';

  accessibilityContactPhoneNumber = '';

  accessibilityContactEmail = '';

  accessibilityContactDeadline = null;

  // minimum date for calendar
  currentDate = new Date();

  // modal for filling out city record information
  modalOpen = false;

  // computed properties that check for whether a user has not filled in
  // a required input field
  @computed('hasAccessibilityOptions')
  get hasAccessibilityOptionsAnswerMissing() {
    return this.get('hasAccessibilityOptions') === null;
  }

  @computed('requesterFullName')
  get requesterFullNameMissing() {
    return !this.get('requesterFullName');
  }

  @computed('requesterPhoneNumber')
  get requesterPhoneNumberMissing() {
    return !this.get('requesterPhoneNumber');
  }

  @computed('requesterEmail')
  get requesterEmailMissing() {
    return !this.get('requesterEmail');
  }

  @computed('accessibilityContactFullName')
  get accessibilityContactFullNameMissing() {
    return !this.get('accessibilityContactFullName');
  }

  @computed('accessibilityContactPhoneNumber')
  get accessibilityContactPhoneNumberMissing() {
    return !this.get('accessibilityContactPhoneNumber');
  }

  @computed('accessibilityContactEmail')
  get accessibilityContactEmailMissing() {
    return !this.get('accessibilityContactEmail');
  }

  @computed('accessibilityContactDeadline')
  get accessibilityContactDeadlineMissing() {
    return !this.get('accessibilityContactDeadline');
  }

  // if fieldsMissing === true, the button that is displayed will not
  // have an href link, but instead just set checkIfMissing === true
  // which notifies the user of missing required inputs
  // if fieldsMissing === false, the button that is displayed will have
  // the href that opens the mailto link
  @computed('hasAccessibilityOptions', 'requesterFullName', 'requesterPhoneNumber', 'requesterEmail', 'accessibilityContactFullName', 'accessibilityContactPhoneNumber', 'accessibilityContactEmail', 'accessibilityContactDeadline')
  get fieldsMissing() {
    return !this.get('requesterFullName')
    || !this.get('requesterPhoneNumber')
    || !this.get('requesterEmail')
    || !this.get('accessibilityContactFullName')
    || !this.get('accessibilityContactPhoneNumber')
    || !this.get('accessibilityContactEmail')
    || !this.get('accessibilityContactDeadline')
    || this.get('hasAccessibilityOptions') === null;
  }

  // modal for filling out city record form
  @action
  openModal() {
    this.set('modalOpen', true);
  }

  // action for button that does not have href link
  // clicking this button will not open up the href mailto
  // but instead just notified user that certain required fields are missing
  @action
  onClickSendButton() {
    this.set('checkIfMissing', true);
  }

  // closes city record form modal
  @action
  closeModal() {
    this.set('modalOpen', false);
  }

  // setting properties for radio buttons
  @action
  setProp(property, newVal) {
    this.set(property, newVal);
  }
}
