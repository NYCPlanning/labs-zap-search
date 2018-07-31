import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';

export default class InfoTooltip extends Component {
  tagName = 'span'

  @argument
  tip = ''

  @argument
  icon = 'info-circle'
}
