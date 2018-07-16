import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { classNames } from '@ember-decorators/component';

@classNames('site-header')
export default class LabsSiteHeaderComponent extends Component {
  @argument
  closed = true;

  @argument
  feedbackTooltip = `
    <p>Please report data errors by using the “Report Data Issue” form on each particular project's page.</p>
    <p class="no-margin">For general feedback about this application, email <strong><a href="mailto:ZAP_Feedback_DL@planning.nyc.gov">ZAP_Feedback_DL@planning.nyc.gov</a></strong>.</p>
  `;
}
