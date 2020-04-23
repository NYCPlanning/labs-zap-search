import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { tagName } from '@ember-decorators/component';
import { contains } from 'ember-composable-helpers/helpers/contains';

/**
 * FilterSectionComponent is a provider component that yields out contextual
 * components, actions, and properties necessary for a filter "section" to
 * mutate a filter value and notify the `appliedFilters` of its state. A
 * filter section can contain references to multiple "filter names" or one,
 * which ids used to tell the query parameters which filters to apply in the query.
 */
@tagName('')
export default class FilterSectionComponent extends Component {
  /**
   * Name(s) of applicable filters. Ensures that they are all applied
   * when the section is toggled on.
   * @argument{Array|String}
   * @required
   */
  filterNames;

  /**
   * Currently applied filters; an array of strings, typically the names of properties
   * used as query parameters; see controllers/query-parameters/show-geography.js.
   * This is passed down from {{filter-mutates}} in its template's yield.
   * @argument{Array}
   * @required
   */
  appliedFilters;

  /**
   * Note: This is threaded down from the parent, yielding component, {{filter-mutators}}.
   * Controller-scoped (bound) mutator function that gets passed a key
   * and values for intersecting, then mutating the array; for example,
   * it points to a named key _string_, checks if the values of the array
   * contain the input values, and adds them or removes them accordingly.
   * Think of as a list value toggler.
   * @argument{Function}
   * @private
   */
  mutateArray = () => {}

  /**
   * Determines whether the filter is active or not, based on the section's filter names
   * and the current list of applied filters.
   */
  @computed('filterNames', 'appliedFilters')
  get filterIsActive() {
    const { filterNames, appliedFilters } = this;

    return contains(filterNames, appliedFilters);
  }

  /**
   * Action used to toggle on and off filter names(s). Used internally and publically.
   * Allows public direct toggling of a given section. For example, this section
   * may be bound to a callback event:
   * `onClearSearchResult=(action section.mutateWithAction)`
   * @public
   */
  @action
  mutateWithAction() {
    const { filterNames } = this;
    this.mutateArray('applied-filters', filterNames);
  }

  /**
   * Runs a provided action, then triggers a notification that something has changed.
   * This is a wrapper action that should wrap around any other action that directly
   * mutates a section's filter property.
   * @public
   */
  @action
  delegateMutation(closureAction = () => {}, ...params) {
    closureAction(...params);
    this.notifyAppliedFilters();
  }

  /*
    Notifies the list of currently applied filters that something has changed,
    and to ensure that the list is updated.

    Groupings of filters were originally IMPLIED based on the markup.
    Now filter-section explicitly knows these groupings and can
    enforce changes to their state if needed.
    @private
  */
  notifyAppliedFilters() {
    const { filterNames, appliedFilters } = this;

    if (!contains(filterNames, appliedFilters)) {
      this.mutateArray('applied-filters', filterNames);
    }
  }
}
