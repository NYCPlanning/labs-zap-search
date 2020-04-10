/**
 * Lookup map for actiontype codes to description strings
 */
const actionTypesLookup = {
  BD: 'Business Improvement Districts',
  BF: 'Business Franchise',
  CM: 'Renewal',
  CP: '',
  DL: 'Disposition for Residential Low-Income Use',
  DM: 'Disposition for Residential Not Low-Income Use',
  EB: 'CEQR Application',
  EC: 'Enclosed Sidewalk Cafes',
  EE: 'CEQR Application',
  EF: 'CEQR Application',
  EM: 'CEQR Application',
  EN: 'CEQR Application',
  EU: 'CEQR Application',
  GF: 'Franchise or Revocable Consent',
  HA: 'Urban Development Action Area',
  HC: 'Minor Change',
  HD: 'Disposition of Urban Renewal Site',
  HF: 'Community Dev. Application/Amendment',
  HG: 'Urban Renewal Designation',
  HI: 'Landmarks - Individual Sites',
  HK: 'Landmarks - Historic Districts ',
  HL: 'Housing/Urban Renewal/Pub Ben Corp Lease',
  HM: 'Currently Residential/Not Low-Income',
  HN: 'Urban Development Action Area - UDAAP Non-ULURP',
  HO: 'Housing Application (Plan and Project)',
  HP: 'Plan & Project/Land Disposition Agreement (LDA) ',
  HR: 'Assignments & Transfers',
  HS: 'Special District/Mall Plan/REMIC NPA',
  HU: 'Urban Renewal Plan and Amendments',
  HZ: 'Preliminary Site Approval Application',
  LD: 'Legal Document (NOC, NOR, RD)',
  MA: 'Assignment/Acquisition',
  MC: 'Major Concessions',
  MD: 'Drainage Plan',
  ME: 'Easements (Administrative)',
  MF: 'Franchise Applic - Not Sidewalk Café',
  ML: 'Landfill',
  MM: 'Change in City Map',
  MP: 'Prior Action',
  MY: 'Administration Demapping',
  NP: '197-A Plan',
  PA: 'Transfer/Assignment',
  PC: 'Combination Acquisition and Site Selection by the City',
  PD: 'Amended Drainage Plan',
  PE: 'Exchange of City Property with Private Property',
  PI: 'Private Improvement',
  PL: 'Leasing of Private Property by the City',
  PM: 'Map Change Related to Site Selection',
  PN: 'Negotiated Disposition of City Property',
  PO: 'OTB Site Selection',
  PP: 'Disposition of Non-Residential City-Owned Property',
  PQ: 'Acquisition of Property by the City',
  PR: "Release of City's Interest",
  PS: 'Site Selection (City Facility) ',
  PX: 'Office Space',
  RA: 'South Richmond District Authorizations ',
  RC: 'South Richmond District Certifications',
  RS: 'South Richmond District Special Permits',
  SC: 'Special Natural Area Certifications',
  TC: 'Consent - Sidewalk Café',
  TL: 'Leasing of C-O-P By Private Applicants',
  UC: 'Unenclosed Café',
  VT: 'Cable TV',
  ZA: 'Zoning Authorization',
  ZC: 'Zoning Certification',
  ZD: 'Amended Restrictive Declaration',
  ZJ: 'Residential Loft Determination',
  ZL: 'Large Scale Special Permit',
  ZM: 'Zoning Map Amendment',
  ZP: 'Parking Special Permit/Incl non-ULURP Ext',
  ZR: 'Zoning Text Amendment ',
  ZS: 'Zoning Special Permit',
  ZX: "Counsel's Office - Rules of Procedure",
  ZZ: 'Site Plan Approval in Natural Area Districts',
};

/**
 * transforms a string of action-type codes into description strings
 * first, separates the string into an array, then does the lookup,
 * then joins back into a ';'-separated string
 * @param {string} actiontypes - ';'-separated list of action types as a string
 * @returns {string}
 */
 // TODO: This doesn't work anymore
export const rollupActionTypes = (row) => {
  row.actiontypes = row.actiontypes ? row.actiontypes
    .split(';')
    .map(at => actionTypesLookup[at]).join(';') : '';
};

export const transformActions = (actions) => {
  return actions
    .filter(({ _dcp_action_value }) => Object.keys(actionTypesLookup).includes(_dcp_action_value))
    .map(action => ({
      ...action,
      dcp_name: (action.dcp_name.split('-')[1] || '').trim(),
    }))
};
