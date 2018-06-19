import { helper } from '@ember/component/helper';

export function lookupDcpDivision([division]) {
  switch(division) {
    case 'Admin':
      return 'DCP Administration';
    case 'BK':
      return 'Brooklyn Borough Office';
    case 'BX':
      return 'Bronx Borough Office';
    case 'HEIP':
      return 'Housing, Economic, & Infrastructure Planning';
    case 'MN':
      return 'Manhattan Borough Office';
    case 'QN':
      return 'Queens Borough Office';
    case 'SI':
      return 'Staten Island Borough Office';
    case 'Transp':
      return 'Transportation';
    case 'TRD':
      return 'Technical Review';
    case 'UD':
      return 'Urban Design';
    case 'WOS':
      return 'Waterfront & Open Space';
    case 'Zoning':
      return 'Zoning';
  }
}

export default helper(lookupDcpDivision);
