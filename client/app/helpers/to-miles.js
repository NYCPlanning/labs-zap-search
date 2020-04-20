import { helper } from '@ember/component/helper';

export function toMiles([lengthInFeet]) {
  return lengthInFeet / 5280;
}

export default helper(toMiles);
