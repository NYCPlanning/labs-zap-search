import moment from 'moment';

const NUM_CB_USER_PROJECTS = 7;
const NUM_BP_USER_PROJECTS = 4;

export default function(server) {
  const seedCBUser = server.create('user', {
    id: 1,
    email: 'qncb5@planning.nyc.gov',
    landUseParticipant: 'QNCB5',
  });

  const seedCBUserProjects = server.createList('project', NUM_CB_USER_PROJECTS);
  seedCBUser.projects = seedCBUserProjects;

  const seedBPUser = server.create('user', {
    id: 2,
    email: 'bxbp@planning.nyc.gov',
    landUseParticipant: 'BXBP',
  });
  const seedBPUserProjects = server.createList('project', NUM_BP_USER_PROJECTS);
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
    for (let j = 0; j < seedCBUserProjects[i].actions.models.length; j += 1) {
      if (i < 3) {
        server.create('disposition', {
          user: seedCBUser,
          project: seedCBUserProjects[i],
          action: seedCBUserProjects[i].actions.models[j],
          publichearinglocation: 'Canal street',
          dateofpublichearing: '2018-11-02T01:21:46',
        });
      } else {
        server.create('disposition', {
          user: seedCBUser,
          project: seedCBUserProjects[i],
          action: seedCBUserProjects[i].actions.models[j],
        });
      }
    }
  }

  for (let i = 0; i < NUM_BP_USER_PROJECTS; i += 1) {
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
  server.create('milestone', 'prepareFiledLandUseApplication', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    displayDate: moment().subtract(95, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'landUseFeePaid', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    displayDate: moment().subtract(90, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'eisDraftScopeReview', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    displayDate: moment().subtract(60, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'ceqrFeePayment', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    displayDate: moment().subtract(70, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'filedEasReview', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    displayDate: moment().subtract(40, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'eisPublicScopingMeeting', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    displayDate: moment().subtract(30, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'finalScopeOfWorkIssued', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    displayDate: moment().subtract(30, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'nocOfDraftIssued', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    displayDate: moment().subtract(5, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'deisPublicHearingHeld', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    displayDate: moment().subtract(20, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'feisPublicSubmittedAndReview', {
    project: seedCBUserProjects[0],
    statuscode: 'Completed',
    displayDate: moment().subtract(10, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'certifiedReferred', {
    project: seedCBUserProjects[0],
    statuscode: 'Not Started',
    displayDate: moment().add(2, 'days'),
    displayDate2: null,
  });

  // "SECOND" CB PROJECT (Upcoming)
  server.create('milestone', 'prepareFiledLandUseApplication', {
    project: seedCBUserProjects[1],
    statuscode: 'Completed',
    displayDate: moment().subtract(32, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'landUseFeePaid', {
    project: seedCBUserProjects[1],
    statuscode: 'Completed',
    displayDate: moment().subtract(30, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'ceqrFeePayment', {
    project: seedCBUserProjects[1],
    statuscode: 'Completed',
    displayDate: moment().add(2, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'filedEasReview', {
    project: seedCBUserProjects[1],
    statuscode: 'Completed',
    displayDate: moment().add(2, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'certifiedReferred', {
    project: seedCBUserProjects[1],
    statuscode: 'Not Started',
    displayDate: moment().add(20, 'days'),
    displayDate2: null,
  });

  // "THIRD" CB PROJECT (Upcoming)
  server.create('milestone', 'prepareFiledLandUseApplication', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    displayDate: moment().subtract(32, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'landUseFeePaid', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    displayDate: moment().subtract(30, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'eisDraftScopeReview', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    displayDate: moment().subtract(10, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'ceqrFeePayment', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    displayDate: moment().add(2, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'filedEasReview', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    displayDate: moment().add(20, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'eisPublicScopingMeeting', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    displayDate: moment().add(30, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'finalScopeOfWorkIssued', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    displayDate: moment().add(30, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'nocOfDraftIssued', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    displayDate: moment().add(5, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'deisPublicHearingHeld', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    displayDate: moment().add(55, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'feisPublicSubmittedAndReview', {
    project: seedCBUserProjects[2],
    statuscode: 'Completed',
    displayDate: moment().add(55, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'certifiedReferred', {
    project: seedCBUserProjects[2],
    statuscode: 'Not Started',
    displayDate: moment().add(60, 'days'),
    displayDate2: null,
  });

  // "FOURTH" CB PROJECT (To Review)
  server.create('milestone', 'certifiedReferred', {
    project: seedCBUserProjects[3],
    statuscode: 'Completed',
    displayDate: moment().subtract(20, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'communityBoardReview', {
    project: seedCBUserProjects[3],
    statuscode: 'In Progress',
    displayDate: moment().subtract(20, 'days'),
    displayDate2: moment().add(40, 'days'),
  });

  // "FIFTH" CB PROJECT (Reviewed)
  server.create('milestone', 'certifiedReferred', {
    project: seedCBUserProjects[4],
    statuscode: 'Completed',
    displayDate: moment().subtract(70, 'days'),
    displayDate2: null,
    milestoneoutcome: 'Certified',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'communityBoardReview', {
    project: seedCBUserProjects[4],
    statuscode: 'Completed',
    displayDate: moment().subtract(70, 'days'),
    displayDate2: moment().subtract(10, 'days'),
    milestoneoutcome: 'Disapproved',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'boroughPresidentReview', {
    project: seedCBUserProjects[4],
    statuscode: 'In Progress',
    displayDate: moment().subtract(9, 'days'),
    displayDate2: moment().add(21, 'days'),
  });

  server.create('milestone', 'boroughBoardReview', {
    project: seedCBUserProjects[4],
    statuscode: 'In Progress',
    displayDate: moment().subtract(9, 'days'),
    displayDate2: moment().add(21, 'days'),
  });

  server.create('milestone', 'cityPlanningCommissionReview', {
    project: seedCBUserProjects[4],
    statuscode: 'Not Started',
    displayDate: moment().add(22, 'days'),
    displayDate2: moment().add(52, 'days'),
  });

  server.create('milestone', 'cityPlanningCommissionVote', {
    project: seedCBUserProjects[4],
    statuscode: 'Not Started',
    displayDate: moment().add(52, 'days'),
    displayDate2: null,
  });

  server.create('milestone', 'cityCouncilReview', {
    project: seedCBUserProjects[4],
    statuscode: 'Not Started',
    displayDate: moment().add(53, 'days'),
    displayDate2: moment().add(83, 'days'),
  });

  server.create('milestone', 'mayoralReview', {
    project: seedCBUserProjects[4],
    statuscode: 'Not Started',
    displayDate: moment().add(84, 'days'),
    displayDate2: moment().add(114, 'days'),
  });

  server.create('milestone', 'finalLetterSent', {
    project: seedCBUserProjects[4],
    statuscode: 'Not Started',
    displayDate: moment().add(120, 'days'),
    displayDate2: null,
  });

  // "SIXTH" CB PROJECT (Reviewed)
  server.create('milestone', 'certifiedReferred', {
    project: seedCBUserProjects[5],
    statuscode: 'Completed',
    displayDate: moment().subtract(70, 'days'),
    displayDate2: null,
    milestoneoutcome: 'Certified',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'communityBoardReview', {
    project: seedCBUserProjects[5],
    statuscode: 'Completed',
    displayDate: moment().subtract(180, 'days'),
    displayDate2: moment().subtract(120, 'days'),
    milestoneoutcome: 'Approved',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'boroughPresidentReview', {
    project: seedCBUserProjects[5],
    statuscode: 'Completed',
    displayDate: moment().subtract(120, 'days'),
    displayDate2: moment().subtract(90, 'days'),
    milestoneoutcome: 'Approved',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'cityPlanningCommissionReview', {
    project: seedCBUserProjects[5],
    statuscode: 'Completed',
    displayDate: moment().subtract(90, 'days'),
    displayDate2: moment().subtract(60, 'days'),
    milestoneoutcome: 'Hearing Closed',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'cityPlanningCommissionVote', {
    project: seedCBUserProjects[5],
    statuscode: 'Completed',
    displayDate: moment().subtract(60, 'days'),
    displayDate2: null,
    milestoneoutcome: 'Approval',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'cityCouncilReview', {
    project: seedCBUserProjects[5],
    statuscode: 'Completed',
    displayDate: moment().subtract(60, 'days'),
    displayDate2: moment().subtract(30, 'days'),
    milestoneoutcome: 'Approval',
  });

  server.create('milestone', 'mayoralReview', {
    project: seedCBUserProjects[5],
    statuscode: 'In Progress',
    displayDate: moment().subtract(30, 'days'),
    displayDate2: moment().add(2, 'days'),
  });

  server.create('milestone', 'finalLetterSent', {
    project: seedCBUserProjects[5],
    statuscode: 'Not Started',
    displayDate: moment().add(120, 'days'),
    displayDate2: null,
  });

  // "SEVENTH" CB PROJECT (Archived)
  server.create('milestone', 'certifiedReferred', {
    project: seedCBUserProjects[6],
    statuscode: 'Completed',
    displayDate: moment().subtract(70, 'days'),
    displayDate2: null,
    milestoneoutcome: 'Certified',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'communityBoardReview', {
    project: seedCBUserProjects[6],
    statuscode: 'Completed',
    displayDate: moment().subtract(180, 'days'),
    displayDate2: moment().subtract(120, 'days'),
    milestoneoutcome: 'Disapproved',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'boroughPresidentReview', {
    project: seedCBUserProjects[6],
    statuscode: 'Completed',
    displayDate: moment().subtract(120, 'days'),
    displayDate2: moment().subtract(90, 'days'),
    milestoneoutcome: 'Approved',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'boroughBoardReview', {
    project: seedCBUserProjects[6],
    statuscode: 'Completed',
    displayDate: moment().subtract(120, 'days'),
    displayDate2: moment().subtract(90, 'days'),
    milestoneoutcome: 'Disapproved',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'cityPlanningCommissionReview', {
    project: seedCBUserProjects[6],
    statuscode: 'Completed',
    displayDate: moment().subtract(90, 'days'),
    displayDate2: moment().subtract(60, 'days'),
    milestoneoutcome: 'Hearing Closed',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'cityPlanningCommissionVote', {
    project: seedCBUserProjects[6],
    statuscode: 'Completed',
    displayDate: moment().subtract(60, 'days'),
    displayDate2: null,
    milestoneoutcome: 'Approval',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', 'cityCouncilReview', {
    project: seedCBUserProjects[6],
    statuscode: 'Completed',
    displayDate: moment().subtract(60, 'days'),
    displayDate2: moment().subtract(30, 'days'),
    milestoneoutcome: 'Approval',
  });

  server.create('milestone', 'mayoralReview', {
    project: seedCBUserProjects[6],
    statuscode: 'Completed',
    displayDate: moment().subtract(30, 'days'),
    displayDate2: moment().subtract(20, 'days'),
    milestoneoutcome: 'No Veto',
  });

  server.create('milestone', 'finalLetterSent', {
    project: seedCBUserProjects[6],
    statuscode: 'Completed',
    displayDate: moment().subtract(10, 'days'),
    displayDate2: null,
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  // // This milestone is what makes seedCBUserProjects[1] "Upcoming"
  // server.create('milestone', {
  //   project: seedCBUserProjects[1],
  //   milestone: COMMUNITY_BOARD_REFERRAL_MILESTONE_ID,
  //   milestonename: 'Community Board Referral',
  //   displayName: 'Community Board Referral',
  //   plannedstartdate: '2018-10-31T01:21:46',
  //   plannedcompletiondate: '2018-11-02T01:21:46',
  //   actualstartdate: null,
  //   actualenddate: null,
  //   statuscode: 'Not Started',
  //   milestonesequence: 28,
  //   displayDate: '2018-10-31T01:21:46',
  //   displayDate2: null,
  //   milestoneoutcome: 'Multiple Borough President Recommendations',
  //   milestoneLinks: [{
  //     filename: '2020_QB.pdf',
  //     url: 'https://www1.nyc.gov/site/planning/index.page',
  //   }],
  // });

  // // - Projects in the "To Review" bin
  // server.create('milestone', {
  //   project: seedCBUserProjects[2],
  //   milestone: COMMUNITY_BOARD_REFERRAL_MILESTONE_ID,
  //   milestonename: 'Community Board Referral',
  //   displayName: 'Community Board Referral',
  //   plannedstartdate: '2018-08-15T01:21:46',
  //   plannedcompletiondate: '2018-10-15T01:21:46',
  //   actualstartdate: '2018-08-15T01:21:46',
  //   actualenddate: null,
  //   statuscode: 'In Progress',
  //   milestonesequence: 36,
  //   displayDate: '2018-08-15T01:21:46',
  //   displayDate2: null,
  //   milestoneoutcome: 'Multiple Borough President Recommendations',
  //   milestoneLinks: [{
  //     filename: '2020_QB.pdf',
  //     url: 'https://www1.nyc.gov/site/planning/index.page',
  //   }],
  // });

  // server.create('milestone', {
  //   project: seedCBUserProjects[3],
  //   milestone: COMMUNITY_BOARD_REFERRAL_MILESTONE_ID,
  //   milestonename: 'Community Board Referral',
  //   displayName: 'Community Board Referral',
  //   plannedstartdate: '2018-08-15T01:21:46',
  //   plannedcompletiondate: '2018-10-15T01:21:46',
  //   actualstartdate: '2018-08-15T01:21:46',
  //   actualenddate: null,
  //   statuscode: 'In Progress',
  //   milestonesequence: 36,
  //   displayDate: '2018-08-15T01:21:46',
  //   displayDate2: null,
  //   milestoneoutcome: 'Multiple Borough President Recommendations',
  //   milestoneLinks: [{
  //     filename: '2020_QB.pdf',
  //     url: 'https://www1.nyc.gov/site/planning/index.page',
  //   }],
  // });

  // server.create('milestone', {
  //   project: seedCBUserProjects[4],
  //   milestone: COMMUNITY_BOARD_REFERRAL_MILESTONE_ID,
  //   milestonename: 'Community Board Referral',
  //   displayName: 'Community Board Referral',
  //   plannedstartdate: '2018-08-15T01:21:46',
  //   plannedcompletiondate: '2018-10-15T01:21:46',
  //   actualstartdate: '2018-08-15T01:21:46',
  //   actualenddate: null,
  //   statuscode: 'In Progress',
  //   milestonesequence: 36,
  //   displayDate: '2018-08-15T01:21:46',
  //   displayDate2: null,
  //   milestoneoutcome: 'Multiple Borough President Recommendations',
  //   milestoneLinks: [{
  //     filename: '2020_QB.pdf',
  //     url: 'https://www1.nyc.gov/site/planning/index.page',
  //   }],
  // });

  // // - Projects in the "Reviewed" bin
  // server.create('milestone', {
  //   project: seedCBUserProjects[5],
  //   milestone: CITY_COUNCIL_REVIEW_MILESTONE_ID,
  //   milestonename: 'City Council Review',
  //   plannedstartdate: null,
  //   plannedcompletiondate: null,
  //   actualstartdate: '2016-04-22T01:40:24',
  //   actualenddate: '2022-05-02T01:40:24',
  //   statuscode: 'Not Started',
  //   milestonesequence: 60,
  //   displayName: 'City Council Review',
  //   displayDate: null,
  //   displayDate2: null,
  //   milestoneoutcome: 'Multiple Borough President Recommendations',
  //   milestoneLinks: [{
  //     filename: '2020_QB.pdf',
  //     url: 'https://www1.nyc.gov/site/planning/index.page',
  //   }],
  // });

  // // This milestone is what makes seedCBUserProjects[0] "Reviewed"
  // server.create('milestone', {
  //   project: seedCBUserProjects[5],
  //   milestone: COMMUNITY_BOARD_REFERRAL_MILESTONE_ID,
  //   milestonename: 'Community Board Referral',
  //   displayName: 'Community Board Referral',
  //   plannedstartdate: '2018-10-31T01:21:46',
  //   plannedcompletiondate: '2018-11-02T01:21:46',
  //   actualstartdate: null,
  //   actualenddate: null,
  //   statuscode: 'Completed',
  //   milestonesequence: 28,
  //   displayDate: '2018-10-31T01:21:46',
  //   displayDate2: null,
  //   milestoneoutcome: 'Multiple Borough President Recommendations',
  //   milestoneLinks: [{
  //     filename: '2020_QB.pdf',
  //     url: 'https://www1.nyc.gov/site/planning/index.page',
  //   }],
  // });

  // server.create('milestone', {
  //   project: seedCBUserProjects[6],
  //   milestone: FINAL_LETTER_SENT_MILESTONE_ID,
  //   milestonename: 'Final Letter Sent',
  //   plannedstartdate: '2018-04-22T01:40:24',
  //   plannedcompletiondate: '2018-05-02T01:40:24',
  //   actualstartdate: null,
  //   actualenddate: null,
  //   statuscode: 'Not Started',
  //   milestonesequence: 60,
  //   displayName: 'Final Letter Sent',
  //   displayDate: null,
  //   displayDate2: null,
  //   milestoneoutcome: 'Multiple Borough President Recommendations',
  //   milestoneLinks: [{
  //     filename: '2020_QB.pdf',
  //     url: 'https://www1.nyc.gov/site/planning/index.page',
  //   }],
  // });

  // // This milestone is what makes seedCBUserProjects[0] "Reviewed"
  // server.create('milestone', {
  //   project: seedCBUserProjects[6],
  //   milestone: COMMUNITY_BOARD_REFERRAL_MILESTONE_ID,
  //   milestonename: 'Community Board Referral',
  //   displayName: 'Community Board Referral',
  //   plannedstartdate: '2018-10-31T01:21:46',
  //   plannedcompletiondate: '2018-11-02T01:21:46',
  //   actualstartdate: null,
  //   actualenddate: null,
  //   statuscode: 'Completed',
  //   milestonesequence: 28,
  //   displayDate: '2018-10-31T01:21:46',
  //   displayDate2: null,
  //   milestoneoutcome: 'Multiple Borough President Recommendations',
  //   milestoneLinks: [{
  //     filename: '2020_QB.pdf',
  //     url: 'https://www1.nyc.gov/site/planning/index.page',
  //   }],
  // });

  // // For a BP participantType....
  // // - BP Projects in the "Upcoming" bin to milestone
  // server.create('milestone', {
  //   project: seedBPUserProjects[0],
  //   milestone: REVIEW_SESSION_CERTIFIED_REFERRED_MILESTONE_ID,
  //   milestonename: 'Land Use Fee Payment',
  //   plannedstartdate: '2018-10-31T01:21:46',
  //   plannedcompletiondate: '2018-11-02T01:21:46',
  //   actualstartdate: null,
  //   actualenddate: null,
  //   statuscode: 'Completed',
  //   milestonesequence: 28,
  //   displayName: 'Land Use Fee Payment',
  //   displayDate: '2018-10-31T01:21:46',
  //   displayDate2: null,
  //   milestoneoutcome: 'Multiple Borough President Recommendations',
  //   milestoneLinks: [{
  //     filename: '2020_QB.pdf',
  //     url: 'https://www1.nyc.gov/site/planning/index.page',
  //   }],
  // });
  // // - BP Projects in the "To Review" bin
  // server.create('milestone', {
  //   project: seedBPUserProjects[1],
  //   milestone: BOROUGH_PRESIDENT_REFERRAL_MILESTONE_ID,
  //   milestonename: 'Borough President Referral',
  //   plannedstartdate: '2018-08-15T01:21:46',
  //   plannedcompletiondate: '2018-10-15T01:21:46',
  //   actualstartdate: '2018-08-15T01:21:46',
  //   actualenddate: null,
  //   statuscode: 'In Progress',
  //   milestonesequence: 36,
  //   displayName: 'Borough President Referral',
  //   displayDate: '2018-08-15T01:21:46',
  //   displayDate2: null,
  //   milestoneoutcome: 'Multiple Borough President Recommendations',
  //   milestoneLinks: [{
  //     filename: '2020_QB.pdf',
  //     url: 'https://www1.nyc.gov/site/planning/index.page',
  //   }],
  // });

  // server.create('milestone', {
  //   project: seedBPUserProjects[2],
  //   milestone: BOROUGH_PRESIDENT_REFERRAL_MILESTONE_ID,
  //   milestonename: 'Borough President Referral',
  //   plannedstartdate: '2018-08-15T01:21:46',
  //   plannedcompletiondate: '2018-10-15T01:21:46',
  //   actualstartdate: '2018-08-15T01:21:46',
  //   actualenddate: null,
  //   statuscode: 'In Progress',
  //   milestonesequence: 36,
  //   displayName: 'Borough President Referral',
  //   displayDate: '2018-08-15T01:21:46',
  //   displayDate2: null,
  //   milestoneoutcome: 'Multiple Borough President Recommendations',
  //   milestoneLinks: [{
  //     filename: '2020_QB.pdf',
  //     url: 'https://www1.nyc.gov/site/planning/index.page',
  //   }],
  // });

  // // - Projects in the "Reviewed" bin
  // server.create('milestone', {
  //   project: seedBPUserProjects[3],
  //   milestone: CITY_COUNCIL_REVIEW_MILESTONE_ID,
  //   milestonename: 'City Council Review',
  //   plannedstartdate: null,
  //   plannedcompletiondate: null,
  //   actualstartdate: '2016-04-22T01:40:24',
  //   actualenddate: '2022-05-02T01:40:24',
  //   statuscode: 'Not Started',
  //   milestonesequence: 60,
  //   displayName: 'City Council Review',
  //   displayDate: null,
  //   displayDate2: null,
  //   milestoneoutcome: 'Multiple Borough President Recommendations',
  //   milestoneLinks: [{
  //     filename: '2020_QB.pdf',
  //     url: 'https://www1.nyc.gov/site/planning/index.page',
  //   }],
  // });
}
