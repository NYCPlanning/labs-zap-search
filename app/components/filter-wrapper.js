import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { classNames, className } from '@ember-decorators/component';

/**
 * FilterWrapperComponent contains all the markup needed for a typical filter which includes
 * the "toggle" markup, certain computed CSS class names, and a reference to the main
 * mutator function.
 */
@classNames('filter')
export default class FilterWrapperComponent extends Component {
  /**
   * Note: this is threaded down from {{filter-section}}.
   * Name(s) of applicable filters. Ensures that they are all applied
   * when the section is toggled on.
   * @argument{Array|String}
   * @required
   */
  filterNames;

  /**
   * Note: this is threaded down from {{filter-section}}.
   * Currently applied filters; an array of strings, typically the names of properties
   * used as query parameters; see controllers/query-parameters/show-geography.js.
   * This is passed down from {{filter-mutates}} in its template's yield.
   * @argument{Array}
   * @required
   */
  appliedFilters;

  /**
   * User-friendly title of the filter, also used to generate a CSS class selector
   * @argument{String}
   */
  filterTitle = '';

  /**
   * Note: this is threaded down from {{filter-section}}.
   * Action used to toggle on and off filter names(s). Used internally and publically.
   * Allows public direct toggling of a given section. For example, this section
   * may be bound to a callback event:
   * `onClearSearchResult=(action section.mutateWithAction)`
   * @public
   */
  mutateWithAction = () => {};

  /**
   * Note: this is threaded down from {{filter-section}}.
   * Determines whether the filter is active or not, based on the section's filter names
   * and the current list of applied filters.
   */
  filterIsActive = false;

  /**
   * Tooltip message
   * @argument{String}
   * @optional
   */
  tooltip;

  /**
   * CSS class name computed and applied directly to the component's element based on
   * active state. Used for styling.
   */
  @className
  @computed('filterIsActive')
  get activeState() {
    return this.filterIsActive ? 'active' : 'inactive';
  }

  /**
   * CSS class name computed and applied directly to the component's element. Used for styling.
   * Based on the filter title.
   */
  @className
  @computed('filterTitle')
  get dasherizedFilterTitle() {
    const dasherizedFilterTitle = this.filterTitle.dasherize();
    return `filter-section-${dasherizedFilterTitle}`;
  }
}
