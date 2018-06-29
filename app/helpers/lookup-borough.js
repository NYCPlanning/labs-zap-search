import { helper } from '@ember/component/helper';

export const boroughLookup = [
  ['1', 'Manhattan'],
  ['2', 'Bronx'],
  ['3', 'Brooklyn'],
  ['4', 'Queens'],
  ['5', 'Staten Island'],
].map(([code, boroname]) => ({ code, boroname, searchField: boroname }));

export function lookupBorough([borocode]) {
  if (borocode === undefined) return boroughLookup;

  const { boroname } = boroughLookup.find(({ code }) => borocode === code) || {};
  return boroname;
}

export default helper(lookupBorough);
