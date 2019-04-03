import { helper } from '@ember/component/helper';
import circle from '@turf/circle';
import { toMiles } from 'labs-zap-search/helpers/to-miles';

export function generateCircleFromFeet([point, radius]) {
  return circle(point, toMiles([radius]), { unit: 'miles' });
}

export default helper(generateCircleFromFeet);
