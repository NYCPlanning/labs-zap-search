import Component from '@ember/component';
// import { argument } from '@ember-decorators/argument';
import { action } from '@ember-decorators/object';
import moment from 'moment';

const fromEpoch = function(number, format) {
  return moment(number, 'X').utc().format(format);
};

// Valid date input
const defaultStart = [-2114380799, 2114380799];

export default class SliderFilterComponent extends Component {
  // @argument
  start = defaultStart;

  // @argument
  min = defaultStart[0];

  // @argument
  max = defaultStart[1];

  format = {
    to: number => fromEpoch(number, 'YYYY'),
    from: number => fromEpoch(number, 'YYYY'),
  }

  // @argument
  replaceProperty() {} // eslint-disable-line

  @action
  sliderChanged([min, max]) {
    // because the slider returns unix epochs based on its own step increment,
    // get the startOf() the min timestamp's year, and the endOf() of the max timestamp's year
    const minStart = parseInt(moment(min, 'X').utc().startOf('year').format('X'), 10);
    const maxEnd = parseInt(moment(max, 'X').utc().endOf('year').format('X'), 10);

    this.replaceProperty([minStart, maxEnd]);
  }
}
