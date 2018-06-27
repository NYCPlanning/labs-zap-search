import { helper } from '@ember/component/helper';

export const dcpDivisions = [
  ['Admin','DCP Administration'],
  ['BK','Brooklyn Borough Office'],
  ['BX','Bronx Borough Office'],
  ['HEIP','Housing, Economic, & Infrastructure Planning'],
  ['MN','Manhattan Borough Office'],
  ['QN','Queens Borough Office'],
  ['SI','Staten Island Borough Office'],
  ['Transp','Transportation'],
  ['TRD','Technical Review'],
  ['UD','Urban Design'],
  ['WOS','Waterfront & Open Space'],
  ['Zoning','Zoning'],
].map(([code, division]) => ({ code, division }));

export function lookupDcpDivision([key]) {
  const { division } = dcpDivisions.find(({ code }) => key === code) || {};
  return division;
}

export default helper(lookupDcpDivision);
