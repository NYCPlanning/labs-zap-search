import { Factory, trait } from 'ember-cli-mirage';
import moment from 'moment';

export default Factory.extend({

  dcpPlannedstartdate: null,
  dcpPlannedcompletiondate: null,
  dcpActualstartdate: null,
  dcpActualenddate: null,
  statuscode: null,
  displayDate: null,
  displayDate2: null,
  outcome: null,
  milestoneLinks: [],

  isCompleted: trait({
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(95, 'days'),
    displayDate: moment().subtract(95, 'days'),
  }),

  isInProgress: trait({
    statuscode: 'In Progress',
    dcpActualstartdate: moment().subtract(3, 'days'),
    displayDate: moment().subtract(3, 'days'),
  }),

  isNotStarted: trait({
    statuscode: 'Not Started',
    dcpActualstartdate: moment().add(95, 'days'),
    displayDate: moment().add(95, 'days'),
  }),

  // UPCOMING MILESTONES FOR ALL LUP USERS
  prepareFiledLandUseApplication: trait({
    dcpMilestone: '663beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Land Use Application Filed',
    dcpMilestonesequence: 26,
    displayName: 'Land Use Application Filed',
  }),

  landUseFeePaid: trait({
    dcpMilestone: '6a3beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Land Use Fee Paid',
    dcpMilestonesequence: 28,
    displayName: 'Land Use Fee Paid',
  }),

  eisDraftScopeReview: trait({
    dcpMilestone: '7c3beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Draft Scope of Work for Environmental Impact Statement Received',
    dcpMilestonesequence: 33,
    displayName: 'Draft Scope of Work for Environmental Impact Statement Received',
  }),

  ceqrFeePayment: trait({
    dcpMilestone: '763beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'CEQR Fee Paid',
    dcpMilestonesequence: 36,
    displayName: 'CEQR Fee Paid',
  }),

  filedEasReview: trait({
    dcpMilestone: '783beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Environmental Assessment Statement Filed',
    dcpMilestonesequence: 37,
    displayName: 'Environmental Assessment Statement Filed',
  }),

  eisPublicScopingMeeting: trait({
    dcpMilestone: '7e3beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Environmental Impact Statement Public Scoping Meeting',
    dcpMilestonesequence: 38,
    displayName: 'Environmental Impact Statement Public Scoping Meeting',
  }),

  finalScopeOfWorkIssued: trait({
    dcpMilestone: '823beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Final Scope of Work for Environmental Impact Statement Issued',
    dcpMilestonesequence: 40,
    displayName: 'Final Scope of Work for Environmental Impact Statement Issued',
  }),

  nocOfDraftIssued: trait({
    dcpMilestone: '843beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Draft Environmental Impact Statement Completed',
    dcpMilestonesequence: 41,
    displayName: 'Draft Environmental Impact Statement Completed',
  }),

  deisPublicHearingHeld: trait({
    dcpMilestone: '863beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Draft Environmental Impact Statement Public Hearing',
    dcpMilestonesequence: 42,
    displayName: 'Draft Environmental Impact Statement Public Hearing',
  }),

  feisPublicSubmittedAndReview: trait({
    dcpMilestone: '883beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Final Environmental Impact Statement Submitted',
    dcpMilestonesequence: 43,
    displayName: 'Final Environmental Impact Statement Submitted',
  }),

  certifiedReferred: trait({
    dcpMilestone: '8e3beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Application Reviewed at City Planning Commission Review Session',
    dcpMilestonesequence: 46,
    displayName: 'Application Reviewed at City Planning Commission Review Session',
  }),

  // REVIEW MILESTONES (CB REVIEW WILL BE UPCOMING FOR BP)

  communityBoardReview: trait({
    dcpMilestone: '923beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Community Board Review',
    dcpMilestonesequence: 48,
    displayName: 'Community Board Review',
  }),

  boroughPresidentReview: trait({
    dcpMilestone: '943beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Borough President Review',
    dcpMilestonesequence: 49,
    displayName: 'Borough President Review',
  }),

  boroughBoardReview: trait({
    dcpMilestone: '963beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Borough Board Review',
    dcpMilestonesequence: 50,
    displayName: 'Borough Board Review',
  }),

  cityPlanningCommissionReview: trait({
    dcpMilestone: '9e3beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'City Planning Commission Review',
    dcpMilestonesequence: 54,
    displayName: 'City Planning Commission Review',
  }),

  cityPlanningCommissionVote: trait({
    dcpMilestone: 'a43beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'City Planning Commission Vote',
    dcpMilestonesequence: 57,
    displayName: 'City Planning Commission Vote',
  }),

  cityCouncilReview: trait({
    dcpMilestone: 'a63beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'City Council Review',
    dcpMilestonesequence: 58,
    displayName: 'City Council Review',
  }),

  mayoralReview: trait({
    dcpMilestone: 'a83beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Mayoral Review',
    dcpMilestonesequence: 59,
    displayName: 'Mayoral Review',
  }),

  finalLetterSent: trait({
    dcpMilestone: 'aa3beec4-dad0-e711-8116-1458d04e2fb8',
    milestonename: 'Approval Letter Sent to Responsible Agency',
    dcpMilestonesequence: 60,
    displayName: 'Approval Letter Sent to Responsible Agency',
  }),

});
