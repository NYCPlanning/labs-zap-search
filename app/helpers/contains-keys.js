import { helper } from '@ember/component/helper';

export function containsKeys([objects=[], keys=[]], { key='id' }={}) {
  return objects.filter(obj => keys.includes(obj[key]));
}

export default helper(containsKeys);
