import Component from '@ember/component';
import { action } from '@ember-decorators/object';
// import { argument } from '@ember-decorators/argument';
import { run } from '@ember/runloop';
import fetch from 'fetch';
import ENV from 'labs-zap-search/config/environment';

export default class ProjectFeedbackComponent extends Component {
  // @argument
  project

  // @argument
  shareURL = window.location.href;

  // @argument
  shareClosed = true;

  // @argument
  copySuccess = false;

  // @argument
  flagText = '';

  // @argument
  flagClosed = true;

  // @argument
  flagSuccess = false;

  // @argument
  reCaptchaResponse = null;

  @action
  handleModalClose() {
    this.set('shareClosed', true);
    this.set('flagClosed', true);
    this.set('copySuccess', false);
  }

  @action
  handleShareOpen() {
    this.set('shareClosed', false);
    this.set('flagClosed', true);
  }

  @action
  handleShareSuccess() {
    this.set('copySuccess', true);
    run.later(() => {
      this.set('copySuccess', false);
    }, 2000);
  }

  @action
  handleFlagOpen() {
    this.set('shareClosed', true);
    this.set('flagClosed', false);
  }

  @action
  onCaptchaResolved(reCaptchaResponse) {
    this.set('reCaptchaResponse', reCaptchaResponse);
  }

  @action
  submitFlag() {
    const projectname = this.get('project.dcp_projectname');
    const projectid = this.get('project.dcp_name');
    const { flagText, reCaptchaResponse } = this;

    fetch(`${ENV.host}/projects/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectname,
        projectid,
        text: flagText,
        'g-recaptcha-response': reCaptchaResponse,
      }),
    })
      .then(res => res.json())
      .then(({ status }) => {
        if (status === 'success') {
          this.set('flagSuccess', true);
          run.later(() => {
            this.set('flagSuccess', false);
            this.set('flagText', '');
            this.set('flagClosed', true);
          }, 2000);
        }
      })
      .catch(() => {
        alert('Sorry about that. Something broke. Could you open an issue for us?'); // eslint-disable-line
      });
  }
}
