// CRM entitiy enum lookups
const VISIBILITY = {
  GENERAL_PUBLIC: 717170003,
};
const ULURP = {
  ULURP: 717170001,
  'Non-ULURP': 717170000,
};

const CEQRTYPE = {
  'Type II': 717170000,
  'Type I': 717170001,
  Unlisted: 717170002,
};

const STATUSCODE = {
  MISTAKE: 717170003,
  OVERRIDDEN: 717170001,
};

const STATECODE = {
  ACTIVE: '0',
};

const PUBLICSTATUS = {
  Filed: 717170000,
  Certified: 717170001,
  Approved: 717170002,
  Withdrawn: 717170003,
};

const BOROUGH = {
  Bronx: 717170000,
  Brooklyn: 717170002,
  Manhattan: 717170001,
  Queens: 717170003,
  'Staten Island': 717170004,
  Citywide: 717170005,
};

const APPLICANTROLE = {
  APPLICANT: 717170000,
  COAPPLICANT: 717170002,
};

/**
 * Lookups are written to enable creation of FetchXML with correct conditions.
 * However, they're also needed to translate a few values from CRM response back into
 * human-readable format (because sadly the batch POST responses do not include this
 * information as the normal GET responses do). This function enables use of the same
 * lookup objects to do lookups in both directions, so multiple lookups do not have to
 * be maintained.
 *
 * @param {Object} lookup The lookup dict to get key from
 * @param {String\|int} value The value to get key for
 * @returns {String} The lookup object key for the specified value
 */
function keyForValue(lookup, value) {
  return Object.keys(lookup)[Object.values(lookup).indexOf(value)];
}

// post-processing constants
const ALLOWED_ACTION_CODES = ['BD', 'BF', 'CM', 'CP', 'DL', 'DM', 'EB', 'EC', 'EE', 'EF', 'EM', 'EN', 'EU', 'GF', 'HA', 'HC', 'HD', 'HF', 'HG', 'HI', 'HK', 'HL', 'HM', 'HN', 'HO', 'HP', 'HR', 'HS', 'HU', 'HZ', 'LD', 'MA', 'MC', 'MD', 'ME', 'MF', 'ML', 'MM', 'MP', 'MY', 'NP', 'PA', 'PC', 'PD', 'PE', 'PI', 'PL', 'PM', 'PN', 'PO', 'PP', 'PQ', 'PR', 'PS', 'PX', 'RA', 'RC', 'RS', 'SC', 'TC', 'TL', 'UC', 'VT', 'ZA', 'ZC', 'ZD', 'ZJ', 'ZL', 'ZM', 'ZP', 'ZR', 'ZS', 'ZX', 'ZZ'];
const ACTION_DCP_NAME_REGEX = '^(\\w+)\\s*-{1}\\s*(.*)\\s';
const ALLOWED_MILESTONES = ['Borough Board Referral', 'Borough President Referral', 'Prepare CEQR Fee Payment', 'City Council Review', 'Community Board Referral', 'CPC Public Meeting - Public Hearing', 'CPC Public Meeting - Vote', 'DEIS Public Hearing Held', 'Review Filed EAS and EIS Draft Scope of Work', 'DEIS Public Scoping Meeting', 'Prepare and Review FEIS', 'Review Filed EAS', 'Final Letter Sent', 'Issue Final Scope of Work', 'Prepare Filed Land Use Application', 'Prepare Filed Land Use Fee Payment', 'Mayoral Veto', 'DEIS Notice of Completion Issued', 'Review Session - Certified / Referred', 'CPC Review of Modification Scope'];
const MILESTONES = {
  '963beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'Borough Board Review',
    display_description: {
      ULURP: 'The Borough Board has 30 days concurrent with the Borough President’s review period to review the application and issue a recommendation.',
    },
  },
  '943beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'Borough President Review',
    display_description: {
      ULURP: 'The Borough President has 30 days after the Community Board issues a recommendation to review the application and issue a recommendation.',
    },
  },
  '763beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'CEQR Fee Paid',
  },
  'a43beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'City Planning Commission Vote',
  },
  '863beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'Draft Environmental Impact Statement Public Hearing',
  },
  '7c3beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'Draft Scope of Work for Environmental Impact Statement Received',
    display_description: 'A Draft Scope of Work must be recieved 30 days prior to the Public Scoping Meeting.',
  },
  '7e3beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'Environmental Impact Statement Public Scoping Meeting',
  },
  '883beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'Final Environmental Impact Statement Submitted',
    display_description: 'A Final Environmental Impact Statement (FEIS) must be completed ten days prior to the City Planning Commission vote.',
  },
  '783beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'Environmental Assessment Statement Filed',
  },
  'aa3beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'Approval Letter Sent to Responsible Agency',
    display_description: {
      'Non-ULURP': 'For many non-ULURP actions this is the final action and record of the decision.',
    },
  },
  '823beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'Final Scope of Work for Environmental Impact Statement Issued',
  },
  '663beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'Land Use Application Filed',
  },
  '6a3beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'Land Use Fee Paid',
  },
  'a83beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'Mayoral Review',
    display_description: {
      ULURP: 'The Mayor has five days to review the City Councils decision and issue a veto.',
    },
  },
  '843beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'Draft Environmental Impact Statement Completed',
    display_description: 'A Draft Environmental Impact Statement must be completed prior to the City Planning Commission certifying or referring a project for public review.',
  },
  '780593bb-ecc2-e811-8156-1458d04d0698': {
    display_name: 'CPC Review of Council Modification',
    display_sequence: 58,
  },

  'a63beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'City Council Review',
    display_description: {
      ULURP: 'The City Council has 50 days from receiving the City Planning Commission report to call up the application, hold a hearing and vote on the application.',
      'Non-ULURP': 'The City Council reviews text amendments and a few other non-ULURP items.',
    },
  },
  '923beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'Community Board Review',
    display_description: {
      ULURP: 'The Community Board has 60 days from the time of referral (nine days after certification) to hold a hearing and issue a recommendation.',
      'Non-ULURP': 'The City Planning Commission refers to the Community Board for 30, 45 or 60 days.',
    },
  },
  '9e3beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'City Planning Commission Review',
    display_description: {
      ULURP: 'The City Planning Commission has 60 days after the Borough President issues a recommendation to hold a hearing and vote on an application.',
      'Non-ULURP': 'The City Planning Commission does not have a clock for non-ULURP items. It may or may not hold a hearing depending on the action.',
    },
  },
  '9c3beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'Review Session - Pre-Hearing Review / Post Referral',
    display_description: '',
  },
  'a23beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'Review Session - Post Hearing Follow-Up / Future Votes',
    display_description: '',
  },
  '8e3beec4-dad0-e711-8116-1458d04e2fb8': {
    display_name: 'Application Reviewed at City Planning Commission Review Session',
    display_description: {
      ULURP: 'A "Review Session" milestone signifies that the application has been sent to the City Planning Commission (CPC) and is ready for review. The "Review" milestone represents the period of time (up to 60 days) that the CPC reviews the application before their vote.',
      'Non-ULURP': 'A "Review Session" milestone signifies that the application has been sent to the City Planning Commission and is ready for review. The City Planning Commission does not have a clock for non-ULURP items. It may or may not hold a hearing depending on the action.',
    },
  },
};


export default {
  keyForValue,
  VISIBILITY,
  ULURP,
  CEQRTYPE,
  STATUSCODE,
  STATECODE,
  PUBLICSTATUS,
  BOROUGH,
  APPLICANTROLE,
  ALLOWED_ACTION_CODES,
  ACTION_DCP_NAME_REGEX,
  ALLOWED_MILESTONES,
  MILESTONES,
};
