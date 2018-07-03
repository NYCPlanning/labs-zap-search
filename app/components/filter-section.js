import Component from '@ember/component';
import { computed, action } from '@ember-decorators/object';
import { classNames, className } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { contains } from 'ember-composable-helpers/helpers/contains';

@classNames('filter')
export default class FilterSectionComponent extends Component {
  @argument
  filterTitle = '';

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

  @className
  @computed('filterTitle')
  get dasherizedFilterTitle() {
    const dasherizedFilterTitle = this.get('filterTitle').dasherize();
    return `filter-section-${dasherizedFilterTitle}`;
  }

  @argument
  mutateArray() {}

  @action
  mutateWithAction() {
   const filterNames = this.get('filterNames');
   this.get('mutateArray')('applied-filters', filterNames);
  }

  /*
    This special action wraps a given passed action with a 
    notifier trigger. 
  */
  @action
  delegateMutation(action = function() {}, ...params) {
    action(...params);
    this.notifyAppliedFilters();
  }

  /*
    Groupings of filters were originally IMPLIED based on the markup.
    Now filter-section explicitly knows these groupings and can
    enforce changes to their state if needed.
  */
  notifyAppliedFilters() {
    const filterNames = this.get('filterNames');
    const appliedFilters = this.get('appliedFilters');

    if (!contains(filterNames, appliedFilters)) {
      this.get('mutateArray')('applied-filters', filterNames)
    }
  }
}
