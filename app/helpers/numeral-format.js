import { helper } from '@ember/component/helper';
import numeral from 'numeral';

export function numeralFormat([number, format = '0,0']) {
  return numeral(number).format(format);
}

export default helper(numeralFormat);
