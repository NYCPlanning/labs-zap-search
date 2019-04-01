import { helper } from '@ember/component/helper';
import circle from '@turf/circle';

export function circleGenerator(params) {
  return circle(...params);
}

export default helper(circleGenerator);
