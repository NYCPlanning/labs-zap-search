import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import fetch from 'fetch';
import ENV from 'labs-zap-search/config/environment';
import { validateEmail } from '../helpers/validate-email';

export default class SubscribeController extends Controller {
  isSubmitting = false;

  lastEmailChecked = '';

  emailAlreadyExists = false;

  emailNeedsConfirmation = false;

  startContinuouslyChecking = false;

  emailSent = false;

  @computed('emailAlreadyExists', 'emailNeedsConfirmation')
  get invalidEmailForSignup() {
    return (this.emailAlreadyExists || this.emailNeedsConfirmation);
  }

  @action
  setIsSubmitting(isSubmittingValue) {
    this.set('isSubmitting', isSubmittingValue);
  }

  @action
  async checkExistingEmail(event) {
    const email = event.target.value;
    if (email === this.lastEmailChecked) { return; }
    this.set('lastEmailChecked', email);
    this.set('startContinuouslyChecking', true);

    try {
      const response = await fetch(`${ENV.host}/subscribers/email/${email}`);
      const userData = await response.json();

      if (userData.error) {
        this.set('emailAlreadyExists', false);
        this.set('emailNeedsConfirmation', false);
        this.set('emailSent', false);
        return;
      }

      if (userData.confirmed === true) {
        this.set('emailAlreadyExists', true);
        this.set('emailNeedsConfirmation', false);
      } else if (userData.confirmed === false) {
        this.set('emailNeedsConfirmation', true);
        this.set('emailAlreadyExists', false);
      }
      return;
    } catch (error) {
      // We will receive an error if:
      // a) the user does not exist in Sendgrid, or
      // b) their confirmed field is null.
      // Either way, we don't need to log to console
      this.set('emailAlreadyExists', false);
      this.set('emailNeedsConfirmation', false);
      this.set('emailSent', false);
    }
  }

  @action
  continuouslyCheckEmail(event) {
    if ((this.startContinuouslyChecking) || (validateEmail(event.target.value))) { this.checkExistingEmail(event); }
  }

  @action
  async sendEmail() {
    if (this.emailAlreadyExists) {
      // Run the script to update the email
      try {
        await fetch(`${ENV.host}/subscribers/${this.model.email}/modify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        this.set('emailSent', true);
      } catch (error) {
        console.error(error); // eslint-disable-line
      }
    } else if (this.emailNeedsConfirmation) {
      // Run the script to confirm the email
      try {
        await fetch(`${ENV.host}/subscribers/${this.model.email}/resend-confirmation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        this.set('emailSent', true);
      } catch (error) {
        console.error(error); // eslint-disable-line
      }
    }
  }
}
