import { helper } from '@ember/component/helper';

/**
 * @param { String } string
 * @param { String } substring
 * returns true if substring is in string
 */
export default helper(function stringIncludes(params) {
  const [string, substring] = params;
  return string.includes(substring);
});
