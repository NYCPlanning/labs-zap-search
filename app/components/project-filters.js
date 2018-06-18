import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { action } from '@ember-decorators/object';

export default class ProjectFiltersComponent extends Component {
  @argument projectFilters = null;
  @argument closed = true;

  @argument
  @action
  mutateArray() {}
}
