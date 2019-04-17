import Component from '@ember/component';
import { action } from '@ember-decorators/object';
import moment from 'moment';

const fromEpoch = function(number, format) {
  return moment(number, 'X').utc().format(format);
};

// Valid date input
const defaultStart = [-2114380799, 2114380799];

/**
 * The SliderFilterComponent is a wrapper component for the {{range-slider}} addon.
 * It provides configuration details to {{ranger-slider}} and provides an event callback
 * that gets triggered when {{range-slider}} mutates something.
 */
export default class SliderFilterComponent extends Component {
  /**
   * Default starting data passed to {{ranger-slider}}
   * @argument{Array}
   * @required
   */
  start = defaultStart;

  /**
   * Smallest possible value for {{ranger-slider}}
   * @argument{Array}
   * @optional
   */
  min = defaultStart[0];

  /**
   * Largest possible value for {{ranger-slider}}
   * @argument{Array}
   * @optional
   */
  max = defaultStart[1];

  /**
   * Date formatting handling object shaped specifically for {{ranger-slider}}
   * @private{Object}
   */
  format = {
    to: number => fromEpoch(number, 'YYYY'),
    from: number => fromEpoch(number, 'YYYY'),
  }

  /**
   * Public event; triggered when {{range-slider}} mutates some data
   * @argument{Function}
   * @public
   */
  replaceProperty = () => {}

  /**
   * Passed to {{range-slider}}; triggered when {{range-slider}} mutates some data
   * @private
   */
  @action
  sliderChanged([min, max]) {
    // because the slider returns unix epochs based on its own step increment,
    // get the startOf() the min timestamp's year, and the endOf() of the max timestamp's year
    const minStart = parseInt(moment(min, 'X').utc().startOf('year').format('X'), 10);
    const maxEnd = parseInt(moment(max, 'X').utc().endOf('year').format('X'), 10);

    this.replaceProperty([minStart, maxEnd]);
  }
}
