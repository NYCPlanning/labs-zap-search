import { helper } from '@ember/component/helper';

export function lookupMilestoneLabel([dcp_name]) {
  switch(dcp_name) {
    case 'Borough Board Referral':
      return 'Borough Board Review';
    case 'Borough President Referral':
      return 'Borough President Review';
    case 'CEQR Fee Payment':
      return 'CEQR Fee Paid';
    case 'City Council Review':
      return 'City Council Review';
    case 'Community Board Referral':
      return 'Community Board Review';
    case 'CPC Public Meeting - Public Hearing':
      return 'City Planning Commission Review / Public Hearing';
    case 'CPC Public Meeting - Vote':
      return 'City Planning Commission Vote';
    case 'DEIS Public Hearing Held':
      return 'Draft Environmental Impact Statement Public Hearing';
    case 'EIS Draft Scope Review':
      return 'Draft Scope of Work for EIS Received';
    case 'EIS Public Scoping Meeting':
      return 'Environmental Impact Statement Public Scoping Meeting';
    case 'FEIS Submitted and Review':
      return 'Final Environmental Impact Statement Submitted';
    case 'Filed EAS Review':
      return 'Environmental Assessment Statement Filed';
    case 'Final Letter Sent':
      return 'Approval Letter Sent to Responsible Agency';
    case 'Final Scope of Work Issued':
      return 'Final Scope of Work for Environmental Impact Statement Issued';
    case 'Land Use Application Filed Review':
      return 'Land Use Application Filed';
    case 'Land Use Fee Payment':
      return 'Land Use Fee Paid';
    case 'Mayoral Veto':
      return 'Mayoral Review';
    case 'NOC of Draft EIS Issued':
      return 'Draft Environmental Impact Statement Completed';
    case 'Review Session - Certified / Referred':
      return 'Application Certified / Referred at City Planning Commission Review Session';
    default:
      return dcp_name;
  }
}

export default helper(lookupMilestoneLabel);
