import RangeSlider from 'ember-cli-nouislider/components/range-slider';

export default class IntegerSliderFilter extends RangeSlider {
  tooltips = [{ to: num => Math.round(num) }];
}
