import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { computed } from '@ember-decorators/object';
import { classNames, className } from '@ember-decorators/component';

@classNames('filter')
export default class FilterWrapperComponent extends Component {
  @argument filterNames;

  @argument appliedFilters;

  @argument filterTitle;

  @argument mutateWithAction;

  @argument tooltip;

  @argument filterIsActive = false;

  @className
  @computed('filterIsActive')
  get activeState() {
    return this.filterIsActive ? 'active' : 'inactive';
  }

  @className
  @computed('filterTitle')
  get dasherizedFilterTitle() {
    const dasherizedFilterTitle = this.filterTitle.dasherize();
    return `filter-section-${dasherizedFilterTitle}`;
  }
}
