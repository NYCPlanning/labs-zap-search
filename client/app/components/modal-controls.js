import Component from '@ember/component';
import { action } from '@ember/object';
import { run } from '@ember/runloop';

export default class ProjectFeedbackComponent extends Component {
  // @argument
  project

  // @argument
  shareURL = window.location.href;

  // @argument
  shareClosed = true;

  // @argument
  copySuccess = false;


  @action
  handleModalClose() {
    this.set('shareClosed', true);
    this.set('copySuccess', false);
  }

  @action
  handleShareOpen() {
    this.set('shareClosed', false);
  }

  @action
  handleShareSuccess() {
    this.set('copySuccess', true);
    run.later(() => {
      this.set('copySuccess', false);
    }, 2000);
  }
}
