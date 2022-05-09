import { helper } from '@ember/component/helper';

export const dcpApplicabilityLookup = [
  {
    code: 1,
    searchField: 'Racial Equity Report Required',
  },
  {
    code: 2,
    searchField: 'Racial Equity Report Not Required',
  },
  {
    code: null,
    searchField: 'Unsure at this time',
  },
];

export function lookupDcpApplicability() {
  return dcpApplicabilityLookup;
}

export default helper(lookupDcpApplicability);
