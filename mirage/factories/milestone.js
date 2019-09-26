import { Factory, trait } from 'ember-cli-mirage';

export default Factory.extend({

  plannedstartdate: null,
  plannedcompletiondate: null,
  actualstartdate: null,
  actualenddate: null,
  statuscode: null,
  displayDate: null,
  displayDate2: null,
  milestoneoutcome: null,
  milestoneLinks: [],

  // UPCOMING MILESTONES FOR ALL LUP USERS
  prepareFiledLandUseApplication: trait({
    milestone: '663beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Land Use Application Filed',
    milestonesequence: 26,
    displayName: 'Land Use Application Filed',
  }),

  landUseFeePaid: trait({
    milestone: '6a3beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Land Use Fee Paid',
    milestonesequence: 28,
    displayName: 'Land Use Fee Paid',
  }),

  eisDraftScopeReview: trait({
    milestone: '7c3beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Draft Scope of Work for Environmental Impact Statement Received',
    milestonesequence: 33,
    displayName: 'Draft Scope of Work for Environmental Impact Statement Received',
  }),

  ceqrFeePayment: trait({
    milestone: '763beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'CEQR Fee Paid',
    milestonesequence: 36,
    displayName: 'CEQR Fee Paid',
  }),

  filedEasReview: trait({
    milestone: '783beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Environmental Assessment Statement Filed',
    milestonesequence: 37,
    displayName: 'Environmental Assessment Statement Filed',
  }),

  eisPublicScopingMeeting: trait({
    milestone: '7e3beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Environmental Impact Statement Public Scoping Meeting',
    milestonesequence: 38,
    displayName: 'Environmental Impact Statement Public Scoping Meeting',
  }),

  finalScopeOfWorkIssued: trait({
    milestone: '823beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Final Scope of Work for Environmental Impact Statement Issued',
    milestonesequence: 40,
    displayName: 'Final Scope of Work for Environmental Impact Statement Issued',
  }),

  nocOfDraftIssued: trait({
    milestone: '843beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Draft Environmental Impact Statement Completed',
    milestonesequence: 41,
    displayName: 'Draft Environmental Impact Statement Completed',
  }),

  deisPublicHearingHeld: trait({
    milestone: '863beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Draft Environmental Impact Statement Public Hearing',
    milestonesequence: 42,
    displayName: 'Draft Environmental Impact Statement Public Hearing',
  }),

  feisPublicSubmittedAndReview: trait({
    milestone: '883beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Final Environmental Impact Statement Submitted',
    milestonesequence: 43,
    displayName: 'Final Environmental Impact Statement Submitted',
  }),

  certifiedReferred: trait({
    milestone: '8e3beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Application Reviewed at City Planning Commission Review Session',
    milestonesequence: 46,
    displayName: 'Application Reviewed at City Planning Commission Review Session',
  }),

  // REVIEW MILESTONES (CB REVIEW WILL BE UPCOMING FOR BP)

  communityBoardReview: trait({
    milestone: '923beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Community Board Review',
    milestonesequence: 48,
    displayName: 'Community Board Review',
  }),

  boroughPresidentReview: trait({
    milestone: '943beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Borough President Review',
    milestonesequence: 49,
    displayName: 'Borough President Review',
  }),

  boroughBoardReview: trait({
    milestone: '963beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Borough Board Review',
    milestonesequence: 50,
    displayName: 'Borough Board Review',
  }),

  cityPlanningCommissionReview: trait({
    milestone: '9e3beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'City Planning Commission Review',
    milestonesequence: 54,
    displayName: 'City Planning Commission Review',
  }),

  cityPlanningCommissionVote: trait({
    milestone: 'a43beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'City Planning Commission Vote',
    milestonesequence: 57,
    displayName: 'City Planning Commission Vote',
  }),

  cityCouncilReview: trait({
    milestone: 'a63beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'City Council Review',
    milestonesequence: 58,
    displayName: 'City Council Review',
  }),

  mayoralReview: trait({
    milestone: 'a83beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Mayoral Review',
    milestonesequence: 59,
    displayName: 'Mayoral Review',
  }),

  finalLetterSent: trait({
    milestone: 'aa3beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Approval Letter Sent to Responsible Agency',
    milestonesequence: 60,
    displayName: 'Approval Letter Sent to Responsible Agency',
  }),

});
