import { helper } from '@ember/component/helper';

export const boroughLookup = [
  ['Citywide'],
  ['Manhattan'],
  ['Bronx'],
  ['Brooklyn'],
  ['Queens'],
  ['Staten Island'],
].map(([code]) => ({ code, searchField: code }));

export function lookupBorough([borocode]) {
  if (borocode === undefined) return boroughLookup;

  const { boroname } = boroughLookup.find(({ code }) => borocode === code) || {};
  return boroname;
}

export default helper(lookupBorough);
