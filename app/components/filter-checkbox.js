import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';

export default class FilterCheckboxComponent extends Component {
  @argument value = '';
  @argument classPrefix = '';
  @argument currentValues = [];
}
