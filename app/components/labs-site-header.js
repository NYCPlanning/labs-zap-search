import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';

export default class LabsSiteHeaderComponent extends Component {
  classNames = ['site-header'];
  @argument closed = true;
}
