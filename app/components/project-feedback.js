import Component from '@ember/component';
import { action } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { run } from '@ember/runloop';
import ENV from 'labs-zap-search/config/environment';


export default class ProjectFeedbackComponent extends Component {
  @argument
  project

  flagText = '';
  flagClosed = true;
  flagSuccess = false;
  reCaptchaResponse = null;


  @action
  handleFlagOpen() {
    this.set('flagClosed', false);
  }

  @action
  handleFlagClose() {
    this.set('flagClosed', true);
    // this.set('copySuccess', false);
  }

  @action
  onCaptchaResolved(reCaptchaResponse) {
    this.set('reCaptchaResponse', reCaptchaResponse);
  }


  @action
  submitFlag() {
    const projectname = this.get('project.dcp_projectname');
    const projectid = this.get('project.dcp_name');
    const flagText = this.get('flagText');
    const reCaptchaResponse = this.get('reCaptchaResponse');

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
      .then(({status}) => {
          if (status === 'success') {
            this.set('flagSuccess', true);
            run.later(() => {
              this.set('flagSuccess', false);
              this.set('flagText', '');
              this.set('flagClosed', true);
            }, 2000);
          }
      });
  }
}
