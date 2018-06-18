import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { action } from '@ember-decorators/object';

export default class ProjectFiltersComponent extends Component {
  @argument projectFilters = null;

  @argument closed = true;

  @action
  mutateArray(key, value) {
    const values = this.get(`projectFilters.${key}`);

    if (values.includes(value)) {
      values.removeObject(value);      
    } else {
      values.pushObject(value);
    }
  }
}
