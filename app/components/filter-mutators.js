import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { tagName } from '@ember-decorators/component';

@tagName('')
export default class BaseFilterComponent extends Component {
  @argument
  appliedFilters;

  @argument
  queryParamsState;

  @argument
  queryParam;

  @argument
  mutateArray() {} // eslint-disable-line

  @argument
  setDebouncedValue() {} // eslint-disable-line

  @argument
  replaceProperty() {} // eslint-disable-line
}
