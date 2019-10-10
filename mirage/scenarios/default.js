import moment from 'moment';

const NUM_CB_USER_PROJECTS = 8;
const NUM_BP_USER_PROJECTS = 4;

export default function(server) {
  const seedCBUser = server.create('user', {
    id: 1,
    email: 'qncb5@planning.nyc.gov',
    landUseParticipant: 'QNCB5',
  });

  const seedCBUserProjects = server.createList('project', NUM_CB_USER_PROJECTS, {
    dcpLupteammemberrole: 'CB',
  });
  seedCBUser.projects = seedCBUserProjects;

  const seedBPUser = server.create('user', {
    id: 2,
    email: 'bxbp@planning.nyc.gov',
    landUseParticipant: 'BXBP',
  });

  const seedBBUser = server.create('user', {
    id: 3,
    email: 'bxbb@planning.nyc.gov',
    landUseParticipant: 'BXBB',
  });

  const seedBPUserProjects = server.createList('project', NUM_BP_USER_PROJECTS, {
    dcpLupteammemberrole: 'BP',
  });
  seedBPUser.projects = seedBPUserProjects;

  for (let i = 0; i < NUM_CB_USER_PROJECTS; i += 1) {
    server.create('userProjectParticipantType', {
      user: seedCBUser,
      project: seedCBUserProjects[i],
      participantType: 'CB',
    });
  }

  /** Seed UserProjectParticipantType */
  server.create('userProjectParticipantType', {
    user: seedBPUser,
    project: seedBPUserProjects[0],
    participantType: 'BB',
  });

  server.create('userProjectParticipantType', {
    user: seedBPUser,
    project: seedBPUserProjects[0],
    participantType: 'BP',
  });

  server.create('userProjectParticipantType', {
    user: seedBPUser,
    project: seedBPUserProjects[1],
    participantType: 'BP',
  });

  server.create('userProjectParticipantType', {
    user: seedBPUser,
    project: seedBPUserProjects[2],
    participantType: 'BP',
  });

  server.create('userProjectParticipantType', {
    user: seedBPUser,
    project: seedBPUserProjects[3],
    participantType: 'BB',
  });

  for (let i = 0; i < NUM_CB_USER_PROJECTS; i += 1) {
    // The number of actions created here cannot be more than the number of unique
    // action codes in the action factory.
    const newActions = server.createList('action', (i % 2 === 1) ? 1 : 7);
    seedCBUserProjects[i].actions = newActions;
    for (let j = 0; j < seedCBUserProjects[i].actions.models.length; j += 1) {
      if (i > 4) {
        server.create('disposition', 'submittedCommunityBoardDisposition', {
          user: seedCBUser,
          project: seedCBUserProjects[i],
          action: seedCBUserProjects[i].actions.models[j],
          dcpPublichearinglocation: 'Canal Street',
          dcpDateofpublichearing: moment().subtract(22, 'days'),
          // In reality this should fall within the community board review's duration,
          // so this mock date may not be accurate.
          dcpDatereceived: moment().subtract(80, 'days'),
        });
      } else {
        server.create('disposition', {
          user: seedCBUser,
          project: seedCBUserProjects[i],
          action: seedCBUserProjects[i].actions.models[j],
          dcpPublichearinglocation: null,
          dcpDateofpublichearing: null,
          // In reality this should fall within the community board review's duration,
          // so this mock date may not be accurate.
          dcpDatereceived: moment().subtract(80, 'days'),
        });
      }
      if (i > 5) {
        server.create('disposition', 'submittedBoroughPresidentDisposition', {
          user: seedBPUser,
          project: seedCBUserProjects[i],
          action: seedCBUserProjects[i].actions.models[j],
          dcpPublichearinglocation: 'Nassau street',
          dcpDateofpublichearing: moment().subtract(10, 'days'),
          dcpBoroughboardrecommendation: 'Disapproved',
          // In reality this should fall within the president's review duration,
          // so this mock date may not be accurate.
          dcpDatereceived: moment().subtract(120, 'days'),
        });
        server.create('disposition', 'submittedBoroughBoardDisposition', {
          user: seedBBUser,
          project: seedCBUserProjects[i],
          action: seedCBUserProjects[i].actions.models[j],
          dcpPublichearinglocation: 'Fulton street',
          dcpDateofpublichearing: moment().subtract(10, 'days'),
          dcpBoroughboardrecommendation: 'Approved',
          // In reality this should fall within the board's review duration,
          // so this mock date may not be accurate.
          dcpDatereceived: moment().subtract(100, 'days'),
        });
      }
    }
  }

  for (let i = 0; i < NUM_BP_USER_PROJECTS; i += 1) {
    // The number of actions created here cannot be more than the number of unique
    // action codes in the action factory.
    const numActions = (i % 2 === 0) ? 1 : 4;
    server.createList('action', numActions, { project: seedBPUserProjects[i] });
    for (let j = 0; j < seedBPUserProjects[i].actions.models.length; j += 1) {
      server.create('disposition', {
        user: seedBPUser,
        project: seedBPUserProjects[i],
        action: seedBPUserProjects[i].actions.models[j],
      });
    }
  }

  /*  Milestones  */

  // "FIRST" CB PROJECT (Upcoming)
  seedCBUserProjects[0].update({
    tab: 'upcoming',
    dcpPublicstatusSimp: 'filed',
  });

  server.create('milestone', 'prepareFiledLandUseApplication', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(95, 'days'),
    displayDate: moment().subtract(95, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'landUseFeePaid', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(90, 'days'),
    displayDate: moment().subtract(90, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'eisDraftScopeReview', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(60, 'days'),
    displayDate: moment().subtract(60, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'ceqrFeePayment', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(70, 'days'),
    displayDate: moment().subtract(70, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'filedEasReview', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(40, 'days'),
    displayDate: moment().subtract(40, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'eisPublicScopingMeeting', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(30, 'days'),
    displayDate: moment().subtract(30, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'finalScopeOfWorkIssued', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(30, 'days'),
    displayDate: moment().subtract(30, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'nocOfDraftIssued', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(5, 'days'),
    displayDate: moment().subtract(5, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'deisPublicHearingHeld', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(20, 'days'),
    displayDate: moment().subtract(20, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'feisPublicSubmittedAndReview', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(10, 'days'),
    displayDate: moment().subtract(10, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'certifiedReferred', {
    project: seedCBUserProjects[0],
    statuscode: 'Not Started',
    dcpActualstartdate: moment().add(2, 'days'),
    displayDate: moment().add(2, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  // Here, mock that the CB user's first project
  // has not yet reached Public Review/their respective Review Period
  server.create('milestone', 'communityBoardReview', {
    project: seedCBUserProjects[0],
    statuscode: 'Not Started',
    dcpPlannedstartdate: moment().add(32, 'days'),
    displayDate: moment().add(32, 'days'),
  });

  // "SECOND" CB PROJECT (Upcoming)
  seedCBUserProjects[1].update({
    tab: 'upcoming',
    dcpPublicstatusSimp: 'filed',
  });

  server.create('milestone', 'prepareFiledLandUseApplication', {
    project: seedCBUserProjects[1],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(32, 'days'),
    displayDate: moment().subtract(32, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'landUseFeePaid', {
    project: seedCBUserProjects[1],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(30, 'days'),
    displayDate: moment().subtract(30, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'ceqrFeePayment', {
    project: seedCBUserProjects[1],
    statuscode: 'Completed',
    dcpActualstartdate: moment().add(2, 'days'),
    displayDate: moment().add(2, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'filedEasReview', {
    project: seedCBUserProjects[1],
    statuscode: 'Completed',
    dcpActualstartdate: moment().add(2, 'days'),
    displayDate: moment().add(2, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'certifiedReferred', {
    project: seedCBUserProjects[1],
    statuscode: 'Not Started',
    dcpActualstartdate: moment().add(20, 'days'),
    displayDate: moment().add(20, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  // CB user's second project has also not yet reached Public Review/their respective Review Period
  server.create('milestone', 'communityBoardReview', {
    project: seedCBUserProjects[1],
    statuscode: 'Not Started',
    dcpPlannedstartdate: moment().add(52, 'days'),
    displayDate: moment().add(52, 'days'),
  });

  // "THIRD" CB PROJECT (Upcoming)
  seedCBUserProjects[2].update({
    tab: 'upcoming',
    dcpPublicstatusSimp: 'filed',
  });

  server.create('milestone', 'prepareFiledLandUseApplication', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(32, 'days'),
    displayDate: moment().subtract(32, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'landUseFeePaid', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(30, 'days'),
    displayDate: moment().subtract(30, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'eisDraftScopeReview', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(10, 'days'),
    displayDate: moment().subtract(10, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'ceqrFeePayment', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    dcpActualstartdate: moment().add(2, 'days'),
    displayDate: moment().add(2, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'filedEasReview', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    dcpActualstartdate: moment().add(20, 'days'),
    displayDate: moment().add(20, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'eisPublicScopingMeeting', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    dcpActualstartdate: moment().add(30, 'days'),
    displayDate: moment().add(30, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'finalScopeOfWorkIssued', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    dcpActualstartdate: moment().add(30, 'days'),
    displayDate: moment().add(30, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'nocOfDraftIssued', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    dcpActualstartdate: moment().add(5, 'days'),
    displayDate: moment().add(5, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'deisPublicHearingHeld', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    dcpActualstartdate: moment().add(55, 'days'),
    displayDate: moment().add(55, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'feisPublicSubmittedAndReview', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    dcpActualstartdate: moment().add(55, 'days'),
    displayDate: moment().add(55, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'certifiedReferred', {
    project: seedCBUserProjects[2],
    statuscode: 'Not Started',
    dcpActualstartdate: moment().add(60, 'days'),
    displayDate: moment().add(60, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  // CB user's third project has also not yet reached Public Review/their respective Review Period
  server.create('milestone', 'communityBoardReview', {
    project: seedCBUserProjects[2],
    statuscode: 'Not Started',
    dcpPlannedstartdate: moment().add(90, 'days'),
    displayDate: moment().add(90, 'days'),
  });

  // "FOURTH" CB PROJECT (To Review)
  seedCBUserProjects[3].update({
    tab: 'to-review',
    dcpPublicstatusSimp: 'public-review',
  });
  server.create('milestone', 'certifiedReferred', {
    project: seedCBUserProjects[3],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(20, 'days'),
    displayDate: moment().subtract(20, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'communityBoardReview', {
    project: seedCBUserProjects[3],
    statuscode: 'In Progress',
    dcpActualstartdate: moment().subtract(20, 'days'),
    displayDate: moment().subtract(20, 'days'),
    dcpActualenddate: moment().add(40, 'days'),
    displayDate2: moment().add(40, 'days'),
  });

  // "FIFTH" CB Project (To Review)
  seedCBUserProjects[4].update({
    tab: 'to-review',
    dcpPublicstatusSimp: 'public-review',
  });
  server.create('milestone', 'certifiedReferred', {
    project: seedCBUserProjects[4],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(45, 'days'),
    displayDate: moment().subtract(45, 'days'),
    dcpActualenddate: moment().subtract(40, 'days'),
    displayDate2: moment().subtract(40, 'days'),
  });

  server.create('milestone', 'communityBoardReview', {
    project: seedCBUserProjects[4],
    statuscode: 'In Progress',
    dcpActualstartdate: moment().subtract(40, 'days'),
    displayDate: moment().subtract(40, 'days'),
    dcpActualenddate: moment().add(20, 'days'),
    displayDate2: moment().add(20, 'days'),
  });

  // "SIXTH" CB PROJECT (Reviewed)
  // CB Review completed, but BP and BB review in progress
  // (see below milestones)
  seedCBUserProjects[5].update({
    tab: 'reviewed',
    dcpPublicstatusSimp: 'public-review',
  });

  server.create('milestone', 'certifiedReferred', {
    project: seedCBUserProjects[5],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(70, 'days'),
    displayDate: moment().subtract(70, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
    dcpMilestoneoutcome: 'Certified',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'communityBoardReview', {
    project: seedCBUserProjects[5],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(70, 'days'),
    displayDate: moment().subtract(70, 'days'),
    dcpActualenddate: moment().subtract(10, 'days'),
    displayDate2: moment().subtract(10, 'days'),
    dcpMilestoneoutcome: 'Disapproved',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'boroughPresidentReview', {
    project: seedCBUserProjects[5],
    statuscode: 'In Progress',
    dcpActualstartdate: moment().subtract(9, 'days'),
    displayDate: moment().subtract(9, 'days'),
    dcpActualenddate: moment().add(21, 'days'),
    displayDate2: moment().add(21, 'days'),
  });

  server.create('milestone', 'boroughBoardReview', {
    project: seedCBUserProjects[5],
    statuscode: 'In Progress',
    dcpActualstartdate: moment().subtract(9, 'days'),
    displayDate: moment().subtract(9, 'days'),
    dcpActualenddate: moment().add(21, 'days'),
    displayDate2: moment().add(21, 'days'),
  });

  server.create('milestone', 'cityPlanningCommissionReview', {
    project: seedCBUserProjects[5],
    statuscode: 'Not Started',
    dcpActualstartdate: moment().add(22, 'days'),
    displayDate: moment().add(22, 'days'),
    dcpActualenddate: moment().add(52, 'days'),
    displayDate2: moment().add(52, 'days'),
  });

  server.create('milestone', 'cityPlanningCommissionVote', {
    project: seedCBUserProjects[5],
    statuscode: 'Not Started',
    dcpActualstartdate: moment().add(52, 'days'),
    displayDate: moment().add(52, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'cityCouncilReview', {
    project: seedCBUserProjects[5],
    statuscode: 'Not Started',
    dcpActualstartdate: moment().add(53, 'days'),
    displayDate: moment().add(53, 'days'),
    dcpActualenddate: moment().add(83, 'days'),
    displayDate2: moment().add(83, 'days'),
  });

  server.create('milestone', 'mayoralReview', {
    project: seedCBUserProjects[5],
    statuscode: 'Not Started',
    dcpActualstartdate: moment().add(84, 'days'),
    displayDate: moment().add(84, 'days'),
    dcpActualenddate: moment().add(114, 'days'),
    displayDate2: moment().add(114, 'days'),
  });

  server.create('milestone', 'finalLetterSent', {
    project: seedCBUserProjects[5],
    statuscode: 'Not Started',
    dcpActualstartdate: moment().add(120, 'days'),
    displayDate: moment().add(120, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  // "SEVENTH" CB PROJECT (Reviewed)
  // CB and BP approved, Mayoral Review In Progress
  seedCBUserProjects[6].update({
    tab: 'reviewed',
    dcpPublicstatusSimp: 'public-review',
  });

  server.create('milestone', 'certifiedReferred', {
    project: seedCBUserProjects[6],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(70, 'days'),
    displayDate: moment().subtract(70, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
    dcpMilestoneoutcome: 'Certified',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'communityBoardReview', {
    project: seedCBUserProjects[6],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(180, 'days'),
    displayDate: moment().subtract(180, 'days'),
    dcpActualenddate: moment().subtract(120, 'days'),
    displayDate2: moment().subtract(120, 'days'),
    dcpMilestoneoutcome: 'Approved',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'boroughPresidentReview', {
    project: seedCBUserProjects[6],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(120, 'days'),
    displayDate: moment().subtract(120, 'days'),
    dcpActualenddate: moment().subtract(90, 'days'),
    displayDate2: moment().subtract(90, 'days'),
    dcpMilestoneoutcome: 'Approved',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'cityPlanningCommissionReview', {
    project: seedCBUserProjects[6],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(90, 'days'),
    displayDate: moment().subtract(90, 'days'),
    dcpActualenddate: moment().subtract(60, 'days'),
    displayDate2: moment().subtract(60, 'days'),
    dcpMilestoneoutcome: 'Hearing Closed',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'cityPlanningCommissionVote', {
    project: seedCBUserProjects[6],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(60, 'days'),
    displayDate: moment().subtract(60, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
    dcpMilestoneoutcome: 'Approval',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'cityCouncilReview', {
    project: seedCBUserProjects[6],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(60, 'days'),
    displayDate: moment().subtract(60, 'days'),
    dcpActualenddate: moment().subtract(30, 'days'),
    displayDate2: moment().subtract(30, 'days'),
    dcpMilestoneoutcome: 'Approval',
  });

  server.create('milestone', 'mayoralReview', {
    project: seedCBUserProjects[6],
    statuscode: 'In Progress',
    dcpActualstartdate: moment().subtract(30, 'days'),
    displayDate: moment().subtract(30, 'days'),
    dcpActualenddate: moment().add(2, 'days'),
    displayDate2: moment().add(2, 'days'),
  });

  server.create('milestone', 'finalLetterSent', {
    project: seedCBUserProjects[6],
    statuscode: 'Not Started',
    dcpActualstartdate: moment().add(120, 'days'),
    displayDate: moment().add(120, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  // "EIGHTH" CB PROJECT (Archived)
  seedCBUserProjects[7].update({
    tab: 'archive',
    dcpPublicstatus: 'Approved',
    dcpProjectcompleted: moment().subtract(15, 'days'),
  });

  server.create('milestone', 'certifiedReferred', {
    project: seedCBUserProjects[7],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(70, 'days'),
    displayDate: moment().subtract(70, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
    dcpMilestoneoutcome: 'Certified',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'communityBoardReview', {
    project: seedCBUserProjects[7],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(180, 'days'),
    displayDate: moment().subtract(180, 'days'),
    dcpActualenddate: moment().subtract(120, 'days'),
    displayDate2: moment().subtract(120, 'days'),
    dcpMilestoneoutcome: 'Disapproved',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'boroughPresidentReview', {
    project: seedCBUserProjects[7],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(120, 'days'),
    displayDate: moment().subtract(120, 'days'),
    dcpActualenddate: moment().subtract(90, 'days'),
    displayDate2: moment().subtract(90, 'days'),
    dcpMilestoneoutcome: 'Approved',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'boroughBoardReview', {
    project: seedCBUserProjects[7],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(120, 'days'),
    displayDate: moment().subtract(120, 'days'),
    dcpActualenddate: moment().subtract(90, 'days'),
    displayDate2: moment().subtract(90, 'days'),
    dcpMilestoneoutcome: 'Disapproved',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'cityPlanningCommissionReview', {
    project: seedCBUserProjects[7],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(90, 'days'),
    displayDate: moment().subtract(90, 'days'),
    dcpActualenddate: moment().subtract(60, 'days'),
    displayDate2: moment().subtract(60, 'days'),
    dcpMilestoneoutcome: 'Hearing Closed',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'cityPlanningCommissionVote', {
    project: seedCBUserProjects[7],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(60, 'days'),
    displayDate: moment().subtract(60, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
    dcpMilestoneoutcome: 'Approval',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'cityCouncilReview', {
    project: seedCBUserProjects[7],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(60, 'days'),
    displayDate: moment().subtract(60, 'days'),
    dcpActualenddate: moment().subtract(30, 'days'),
    displayDate2: moment().subtract(30, 'days'),
    dcpMilestoneoutcome: 'Approval',
  });

  server.create('milestone', 'mayoralReview', {
    project: seedCBUserProjects[7],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(30, 'days'),
    displayDate: moment().subtract(30, 'days'),
    dcpActualenddate: moment().subtract(20, 'days'),
    displayDate2: moment().subtract(20, 'days'),
    dcpMilestoneoutcome: 'No Veto',
  });

  server.create('milestone', 'finalLetterSent', {
    project: seedCBUserProjects[7],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(10, 'days'),
    displayDate: moment().subtract(10, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });


  // "FIRST" BP User's project (Upcoming)
  // Public review has already started, but not yet the
  // BP review.
  seedBPUserProjects[0].update({
    tab: 'upcoming',
    dcpPublicstatusSimp: 'public-review',
  });

  server.create('milestone', 'prepareFiledLandUseApplication', {
    project: seedBPUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(95, 'days'),
    displayDate: moment().subtract(95, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'landUseFeePaid', {
    project: seedBPUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(90, 'days'),
    displayDate: moment().subtract(90, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'eisDraftScopeReview', {
    project: seedBPUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(60, 'days'),
    displayDate: moment().subtract(60, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'ceqrFeePayment', {
    project: seedBPUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(70, 'days'),
    displayDate: moment().subtract(70, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'filedEasReview', {
    project: seedBPUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(40, 'days'),
    displayDate: moment().subtract(40, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'eisPublicScopingMeeting', {
    project: seedBPUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(30, 'days'),
    displayDate: moment().subtract(30, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'finalScopeOfWorkIssued', {
    project: seedBPUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(30, 'days'),
    displayDate: moment().subtract(30, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'nocOfDraftIssued', {
    project: seedBPUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(5, 'days'),
    displayDate: moment().subtract(5, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'deisPublicHearingHeld', {
    project: seedBPUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(20, 'days'),
    displayDate: moment().subtract(20, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'feisPublicSubmittedAndReview', {
    project: seedBPUserProjects[0],
    statuscode: 'Completed',
    dcpActualstartdate: moment().subtract(10, 'days'),
    displayDate: moment().subtract(10, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'certifiedReferred', {
    project: seedBPUserProjects[0],
    statuscode: 'Not Started',
    dcpActualstartdate: moment().subtract(2, 'days'),
    displayDate: moment().subtract(2, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  // Here, mock that the BP user's first project
  // has reached Public Review but not yet their respective Review Period
  server.create('milestone', 'communityBoardReview', {
    project: seedBPUserProjects[0],
    statuscode: 'In Progress',
    dcpActualstartdate: moment().subtract(1, 'days'),
    displayDate: moment().subtract(1, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });

  server.create('milestone', 'boroughPresidentReview', {
    project: seedBPUserProjects[0],
    statuscode: 'Not Started',
    dcpPlannedstartdate: moment().add(19, 'days'),
    displayDate: moment().add(19, 'days'),
    dcpActualenddate: null,
    displayDate2: null,
  });
}
