import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { classNames, className } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { contains } from 'ember-composable-helpers/helpers/contains';

@classNames('filter')
export default class FilterSectionComponent extends Component {
  @argument
  filterNames;

  @argument
  appliedFilters;

  @className
  @computed('filterNames', 'appliedFilters')
  get activeState() {
    const filterNames = this.get('filterNames');
    const appliedFilters = this.get('appliedFilters');

    return contains(filterNames, appliedFilters) ? 'active' : 'inactive';
  }

  @argument
  mutateArray() {}
}
