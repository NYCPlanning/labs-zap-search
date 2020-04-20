import { helper } from '@ember/component/helper';

export function merge([left, right]) {
  return { ...left, ...right };
}

export default helper(merge);
