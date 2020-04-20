import Component from '@ember/component';
import { action } from '@ember/object';
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
   * Callback that gets passed to {{range-slider}}; triggered when {{range-slider}}
   * mutates some data. It receives numerics from range-slider, they are sometimes
   * not rounded. This callback performs some cleaning by rounding the values into
   * integers and "rounding" the epoch timestamps to be inclusive of the full year
   * they intersect with.
   *
   * For example, if the toggle lands on march of 2016, this will round to the very
   * beginning of 2016.
   * @private
   */
  @action
  sliderChanged([min, max]) {
    // must round integers because range slider sometimes provides
    // decimal values in the callback
    const roundedMin = Math.round(min);
    const roundedMax = Math.round(max);

    const minStart = parseInt(moment(roundedMin, 'X').utc().startOf('year').format('X'), 10) + 1;
    const maxEnd = parseInt(moment(roundedMax, 'X').utc().endOf('year').format('X'), 10);

    this.replaceProperty([minStart, maxEnd]);
  }
}
