import { helper } from '@ember/component/helper';

export function getActionTooltip([actioncode]) {
  switch(actioncode) {
    case 'BD':
      return 'Business Improvement Districts ';
    case 'BF':
      return 'Business Franchise';
    case 'CM':
      return 'Renewal';
    case 'CP':
      return '';
    case 'CS':
      return 'Substantial Compliance ';
    case 'DL':
      return 'Disposition for Residential Low-Income Use';
    case 'DM':
      return 'Disposition for Residential Not Low-Income Use';
    case 'EAS':
      return 'Environmental Assessment Statement ';
    case 'EB':
      return 'CEQR Application';
    case 'EC':
      return 'Enclosed Sidewalk Cafes ';
    case 'EE':
      return 'CEQR Application';
    case 'EF':
      return 'CEQR Application';
    case 'EIS':
      return 'Environmental Impact Statement ';
    case 'EM':
      return 'CEQR Application';
    case 'EN':
      return 'CEQR Application';
    case 'EU':
      return 'CEQR Application';
    case 'FT':
      return 'Fast Track ';
    case 'GF':
      return 'Franchise or Revocable Consent';
    case 'HA':
      return 'Urban Development Action Area -UDAAP ';
    case 'HC':
      return 'Minor Change ';
    case 'HD':
      return 'Disposition of Urban Renewal Site';
    case 'HF':
      return 'Community Dev. Application/Amendment';
    case 'HG':
      return 'Urban Renewal Designation';
    case 'HI':
      return 'Landmarks -Individual Sites ';
    case 'HK':
      return 'Landmarks -Historic Districts';
    case 'HL':
      return 'Housing/Urban Renewal/Pub Ben Corp Lease';
    case 'HM':
      return 'Currently Residential/Not Low-Income';
    case 'HN':
      return 'Urban Development Action Area -UDAAP Non-ULURP ';
    case 'HO':
      return 'Housing Application (Plan and Project)';
    case 'HP':
      return 'Plan & Project/Land Disposition Agreement (LDA) ';
    case 'HR':
      return 'Assignments & Transfers';
    case 'HS':
      return 'Special District/Mall Plan/REMIC NPA';
    case 'HU':
      return 'Urban Renewal Plan and Amendments ';
    case 'HZ':
      return 'Preliminary Site Approval Application';
    case 'LD':
      return 'Legal Document (NOC, NOR, RD) ';
    case 'MA':
      return 'Assignment/Acquisition';
    case 'MC':
      return 'Major Concessions';
    case 'MD':
      return 'Drainage Plan';
    case 'ME':
      return 'Easements (Administrative)';
    case 'MF':
      return 'Franchise Applic -Not Sidewalk Café';
    case 'ML':
      return 'Landfill';
    case 'MM':
      return 'Change in City Map ';
    case 'MP':
      return 'Prior Action';
    case 'MY':
      return 'Administration Demapping';
    case 'NP':
      return '197-A Plan';
    case 'PA':
      return 'Transfer/Assignment';
    case 'PC':
      return 'Combination Acquisition and Site Selection by the City';
    case 'PD':
      return 'Amended Drainage Plan';
    case 'PE':
      return 'Exchange of City Property with Private Property';
    case 'PI':
      return 'Private Improvement';
    case 'PL':
      return 'Leasing of Private Property by the City';
    case 'PM':
      return 'Map Change Related to Site Selection';
    case 'PN':
      return 'Negotiated Disposition of City Property';
    case 'PO':
      return 'OTB Site Selection';
    case 'PP':
      return 'Disposition of Non-Residential City-Owned Property ';
    case 'PQ':
      return 'Acquisition of Property by the City';
    case 'PR':
      return 'Release of City&apos;s Interest';
    case 'PS':
      return 'Site Selection (City Facility) ';
    case 'PX':
      return 'Office Space';
    case 'RA':
      return 'South Richmond District Authorizations ';
    case 'RC':
      return 'South Richmond District Certifications ';
    case 'RS':
      return 'South Richmond District Special Permits';
    case 'SC':
      return 'Special Natural Area Certifications ';
    case 'Study':
      return 'Study';
    case 'TC':
      return 'Consent -Sidewalk Café';
    case 'TL':
      return 'Leasing of C-O-P By Private Applicants';
    case 'UC':
      return 'Unenclosed Café';
    case 'UK':
      return 'Unknown Action ';
    case 'VT':
      return 'Cable TV';
    case 'WR':
      return 'Waterfront Revitalization Program ';
    case 'ZA':
      return 'Zoning Authorization ';
    case 'ZC':
      return 'Zoning Certification ';
    case 'ZD':
      return 'Amended Restrictive Declaration';
    case 'ZJ':
      return 'Residential Loft Determination';
    case 'ZL':
      return 'Large Scale Special Permit';
    case 'ZM':
      return 'Zoning Map Amendment ';
    case 'ZP':
      return 'Parking Special Permit/Incl non-ULURP Ext';
    case 'ZR':
      return 'Zoning Text Amendment ';
    case 'ZS':
      return 'Zoning Special Permit ';
    case 'ZX':
      return 'Counsel&apos;s Office -Rules of Procedure';
    case 'ZZ':
      return 'Site Plan Approval in Natural Area Districts';
    default:
        return `Tooltip not found for action code ${actioncode}`;
    }
}

export default helper(getActionTooltip);
