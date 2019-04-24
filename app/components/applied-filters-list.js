import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { getLabelFor } from 'labs-zap-search/helpers/get-label-for';

/**
 * Component that takes an array, runs it through a service method
 * for translations, and prints them on the page with a friendly msg.
 */
export default class AppliedFiltersListComponent extends Component {
  /**
   * Array of column names, will be passed through a translator
   *
   * @argument(Array)
   */
  appliedFilters;

  /**
   * Unique "humanized" filter names from the translations/en-us.yaml file.
   */
  @computed('appliedFilters')
  get currentFiltersNames() {
    return this.appliedFilters
      .map(filterName => getLabelFor(`filters.${filterName}`))
      .uniq();
  }
}
