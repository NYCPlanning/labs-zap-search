import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';

/**
 * The FilterMutators component is a "provider" component that only yields out
 * contextualized {{filter-section}} components by delegating out passed actions & properties.
 * It is a convenience wrapper component that yields sub-components with some context that
 * flows downstream of applied filters and the mutator action.
 * This largely prevents a lot of setup for {{filter-section}}s, prevents a bunch of
 * threading arguments. See the template.
 */
@tagName('')
export default class FilterMutators extends Component {
  /**
   * Currently applied filters; an array of strings, typically the names of properties
   * used as query parameters; see controllers/query-parameters/show-geography.js.
   * @argument{Array}
   * @required
   */
  appliedFilters;

  /**
   * Controller object, nested, representing the current state of query params.
   * See https://github.com/offirgolan/ember-parachute#computed-property---queryparamsstate
   * for full details
   * @argument{Object}
   * @required
   */
  queryParamsState;

  /**
   * Controller-scoped (bound) mutator function that gets passed a key
   * and values for intersecting, then mutating the array; for example,
   * it points to a named key _string_, checks if the values of the array
   * contain the input values, and adds them or removes them accordingly.
   * Think of as a list value toggler.
   * @argument{Function}
   */
  mutateArray = (/* key, ...values */) => {}
}
