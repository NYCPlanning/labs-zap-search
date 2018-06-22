import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { classNames } from '@ember-decorators/component';

@classNames('site-header')

export default class LabsSiteHeaderComponent extends Component {
  @argument closed = true;
}
