import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { tagName } from '@ember-decorators/component';

@tagName('a')
export default class NamedCheckboxComponent extends Component {
  @argument
  mainProperty;

  @argument
  label;
}
