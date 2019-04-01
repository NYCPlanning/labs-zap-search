import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { computed } from '@ember-decorators/object';
import { contains } from 'ember-composable-helpers/helpers/contains';
import { classNames, className } from '@ember-decorators/component';

@classNames('filter')
export default class FilterWrapperComponent extends Component {
  @argument filterNames;

  @argument appliedFilters;

  @argument filterTitle;

  @argument mutateWithAction;

  @argument tooltip;

  @className
  @computed('filterNames', 'appliedFilters')
  get activeState() {
    const { filterNames, appliedFilters } = this;

    return contains(filterNames, appliedFilters) ? 'active' : 'inactive';
  }

  @className
  @computed('filterTitle')
  get dasherizedFilterTitle() {
    const dasherizedFilterTitle = this.filterTitle.dasherize();
    return `filter-section-${dasherizedFilterTitle}`;
  }
}
