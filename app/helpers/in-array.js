import { helper } from '@ember/component/helper';

export default helper(function inArray(params) {
  const [arr, elem] = params;
  return arr.includes(elem);
});
