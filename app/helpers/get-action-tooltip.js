import { helper } from '@ember/component/helper';

export function getActionTooltip([actioncode]) {
  switch(actioncode) {
    case 'BD':
      return 'Applicants working to create a Business Improvement District (BID) work with the NYC Department of Small Business Services to create an application for a (BID). Please contact the NYC Department of Small Business Services for more information.';
    case 'BF':
      return 'Business Franchise';
    case 'CM':
      return 'Many times special permit actions or other land use approvals  are approved for a limited time period, and may require renewal should development under the approvals be delayed or take longer than anticipated. Renewals of past actions require early and close consultation with the Department of City Planning.  Please contact the appropriate Borough Office to discuss your project, and be mindful that such outreach should occur well in advance of the expiry date of your initial approvals to avoid lapses.';
    case 'CP':
      return '';
    case 'CS':
      return 'In some cases, the changes may be so small that they do not require any actual modification to the prior ULURP approvals. For example, slight adjustments to dimensions of an approved site plan that do not relate to a zoning waiver or modification granted during the land use review process may be determined to be in “substantial compliance” with the approvals and require no further action by the City Planning Commission or City Council. In such cases, the Department will review the modified drawings which incorporate these adjustments and, if requested by the applicant, advise the Department of Buildings that the project as shown on the modified drawings remains in substantial compliance with the original approval.';
    case 'DL':
      return 'Disposition for Residential Low-Income Use';
    case 'DM':
      return 'Disposition for Residential Not Low-Income Use';
    case 'EAS':
      return 'Environmental Assessment Statement ';
    case 'EB':
      return 'CEQR Application';
    case 'EC':
      return 'Enclosed Sidewalk Cafés allow restaurateurs to enliven public streets by creating outdoor seating for restaurants in approved locations, along specific streets. The application requirements for Enclosed Sidewalk Cafés are governed by the NYC Department of Consumer Affairs. For more information regarding Sidewalk Cafés of all types, please contact the NYC Department of Consumer Affairs.';
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
      return 'A revocable consent is a grant by the city, revocable at will, for private use on, over or under city property such as bridges over streets or street furniture. Revocable consents that the Department of City Planning has determined do not have land use impacts or implications are not subject to ULURP.';
    case 'HA':
      return 'Housing and urban renewal plans and projects, pursuant to city, state and federal laws are required to be reviewed by the City Planning Commission. This action is subject to the Uniform Land Use Review Procedure.';
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
      return 'Proposed New York City Landmarks and Historic Districts are submitted to the Department of City Planning by the Landmarks Preservation Commission to ensure that the landmark designation does not conflict with the Zoning Resolution, projected public improvements or any plans for development, growth, improvement, or renewal in the vicinity of the landmark. &nbsp;Landmark designations are non-ULURP actions.';
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
      return 'A major concession is a grant made by an agency for the private use of city-owned property, and which has significant land use impacts and implications or which requires the preparation of an environmental impact statement. The City Planning Commission has established rules for determining if a concession is major and requires ULURP review.';
    case 'MD':
      return 'Amended drainage plans are submitted to the Department of City Planning for a review of their consistency with the City Map. Drainage plans are non-ULURP actions submitted to DCP by the NYC Department of Environmental Protection.';
    case 'ME':
      return 'An easement allows for an entity or individual to have limited use of another’s property for a specific purpose. Please contact the Department’s Technical Review Division to discuss new easements or modifications to existing easements and the associated application requirements.';
    case 'MF':
      return 'Franchise Applic -Not Sidewalk Café';
    case 'ML':
      return 'Landfill applications are application for the establishment of sanitary or waterfront landfills.';
    case 'MM':
      return 'The City Map is the official adopted map of the city. It shows the location, dimension and grades of streets, parks, public places, and certain public easements. The Director of City Planning is the custodian of the City Map. City Map changes are applications to alter, add, or remove elements from the City Map.';
    case 'MP':
      return 'Prior Action';
    case 'MY':
      return 'Administration Demapping';
    case 'NP':
      return '197-A Plans are formal community-based plans, as set out in Section 197-A of the City Charter, which authorizes community boards and borough boards, along with the Mayor, the City Planning Commission, the Department of City Planning, and any Borough President, to sponsor plans for the development, growth, and improvement of the city, its boroughs and communities. Once approved by the Commission and adopted by the City Council, 197-a plans guide future actions of city agencies in the areas addressed in the plans.';
    case 'PA':
      return 'Transfer/Assignment';
    case 'PC':
      return 'Acquisition and site selection actions are used to purchase and site public facilities in one action.  The Combination Acquisitions and Site Selection action is commonly used for projects including the selection of sites for new city facilities such as sanitation garages, fire houses, libraries and sewage treatment plants. These actions are subject to the Uniform Land Use Review Procedure.';
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
      return 'Dispositions of non-residential city-owned property are used to release property acquired by the city for use or development by another party.  This includes the sale, lease, or exchange of real property. This action is subject to the Uniform Land Use Review Procedure.';
    case 'PQ':
      return 'Acquisition of real property by the city occurs when the city endeavors to acquire real property for the purposes of community or city use.  Office space acquisition is excluded and subject to a separate review pursuant to Section 195 of the City Charter. This action is subject to the Uniform Land Use Review Procedure.';
    case 'PR':
      return 'Release of City&apos;s Interest';
    case 'PS':
      return 'Site selection for capital projects includes the selection of sites for new city facilities such as sanitation garages, fire houses, libraries and sewage treatment plants. A capital project is the construction or acquisition of a public improvement classified as a capital asset of the city. This action is subject to the Uniform Land Use Review Procedure.';
    case 'PX':
      return 'Applications for the leasing of office space by city agencies are typically filed by the Department of Citywide Administrative Services. Office space lease actions are non-ULURP and are required to move through the approval process on a specific timeline.';
    case 'RA':
      return 'A Zoning Authorization within the Special South Richmond Development District (SSRDD) is a discretionary action taken by the City Planning Commission (CPC) that modifies specific zoning requirements if certain findings have been met. Authorizations are not subject to ULURP review and the CPC does not hold public hearings on authorizations. The CPC generally refers such applications to the appropriate community board(s) for comments.';
    case 'RC':
      return 'A Special South Richmond Development District certification is a non-discretionary action taken by the City Planning Commission, or its Chairperson, informing the Department of Buildings that an as-of-right development has complied with specific conditions set forth in accordance with provisions of the Zoning Resolution.';
    case 'RS':
      return 'Special permits within the Special South Richmond Development District (SSRDD) are discretionary approvals that can modify zoning controls within the Special District, such as use, bulk, and parking. Special Permits are reviewed by the City Planning Commission pursuant to the Zoning Resolution and are subject to the Uniform Land Use Review Procedure.';
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
      return 'An authorization is a discretionary action taken by the City Planning Commission (CPC) that modifies specific zoning requirements if certain findings have been met. Authorizations are not subject to ULURP review, and the CPC does not hold public hearings on authorizations. The CPC generally refers such applications to the appropriate community board(s) for comment.';
    case 'ZC':
      return 'Each Zoning Certification is a distinct land use action and requires specific land use application components. Below are comprehensive guides that describe some of the most common actions and their application requirements. For those Zoning Certifications that are not listed below, please refer to the “General Zoning Certification Standards” table at the bottom of the page.';
    case 'ZD':
      return 'Amended Restrictive Declaration';
    case 'ZJ':
      return 'Residential Loft Determination';
    case 'ZL':
      return 'Large Scale Special Permit';
    case 'ZM':
      return 'A Zoning Map Amendment is a change in designation or a change in district boundaries for any zoning district on the New York City Zoning Map.  Zoning Map Amendments are discretionary actions subject to the Uniform Land Use Review Procedure.';
    case 'ZP':
      return 'Parking Special Permit/Incl non-ULURP Ext';
    case 'ZR':
      return 'Zoning Text Amendments are changes to the text of the New York City Zoning Resolution.  Text Amendments do not require the Uniform Land Use Review Procedure, however, in practice; the Department of City Planning refers Zoning Text Amendments to the Community Board for review.';
    case 'ZS':
      return 'A special permit is a discretionary action by the City Planning Commission, subject to ULURP review, or the Board of Standards and Appeals, which may modify use, bulk, or parking regulations if certain conditions and findings specific in the Zoning Resolution are met.';
    case 'ZX':
      return 'Counsel&apos;s Office -Rules of Procedure';
    case 'ZZ':
      return 'Site Plan Approval in Natural Area Districts';
    default:
        return `Tooltip not found for action code ${actioncode}`;
    }
}

export default helper(getActionTooltip);
