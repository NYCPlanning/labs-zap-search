import { helper } from '@ember/component/helper';

export const dcpApplicabilityLookup = [
  {
    code: 1,
    searchField: 'Yes',
  },
  {
    code: 2,
    searchField: 'No',
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
