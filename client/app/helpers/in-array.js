import { helper } from '@ember/component/helper';

/**
 * @param { Any [] } arr
 * @param { Any } elem
 * returns true if elem is in arr
 */
export default helper(function inArray(params) {
  const [arr, elem] = params;
  return arr.includes(elem);
});
