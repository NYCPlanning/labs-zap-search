const NUM_CB_USER_PROJECTS = 7;
const NUM_BP_USER_PROJECTS = 4;

const REVIEW_SESSION_CERTIFIED_REFERRED_MILESTONE_ID = '8E3BEEC4-DAD0-E711-8116-1458D04E2FB8';

const COMMUNITY_BOARD_REFERRAL_MILESTONE_ID = '923BEEC4-DAD0-E711-8116-1458D04E2FB8';
const BOROUGH_PRESIDENT_REFERRAL_MILESTONE_ID = '963BEEC4-DAD0-E711-8116-1458D04E2FB8';
// const BOROUGH_BOARD_REFERRAL_MILESTONE_ID = '943BEEC4-DAD0-E711-8116-1458D04E2FB8';

const CITY_COUNCIL_REVIEW_MILESTONE_ID = 'A63BEEC4-DAD0-E711-8116-1458D04E2FB8';
const FINAL_LETTER_SENT_MILESTONE_ID = 'AA3BEEC4-DAD0-E711-8116-1458D04E2FB8';

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
  // For a CB participantType....
  // - Projects in the "Upcoming" bin to milestone
  server.create('milestone', {
    project: seedCBUserProjects[0],
    milestone: REVIEW_SESSION_CERTIFIED_REFERRED_MILESTONE_ID,
    name: 'ZC - Land Use Fee Payment ',
    milestonename: 'Land Use Fee Payment',
    plannedstartdate: '2018-10-31T01:21:46',
    plannedcompletiondate: '2018-11-02T01:21:46',
    actualstartdate: null,
    actualenddate: null,
    statuscode: 'Completed',
    milestonesequence: 28,
    displayName: 'Land Use Fee Payment',
    displayDate: '2018-10-31T01:21:46',
    displayDate2: null,
    milestoneoutcome: 'Multiple Borough President Recommendations',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  // This milestone is what makes seedCBUserProjects[0] "Upcoming"
  server.create('milestone', {
    project: seedCBUserProjects[0],
    milestone: COMMUNITY_BOARD_REFERRAL_MILESTONE_ID,
    name: 'ZC - Community Board Referral',
    milestonename: 'Community Board Referral',
    displayName: 'Community Board Referral',
    plannedstartdate: '2018-10-31T01:21:46',
    plannedcompletiondate: '2018-11-02T01:21:46',
    actualstartdate: null,
    actualenddate: null,
    statuscode: 'Not Started',
    milestonesequence: 28,
    displayDate: '2018-10-31T01:21:46',
    displayDate2: null,
    milestoneoutcome: 'Multiple Borough President Recommendations',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', {
    project: seedCBUserProjects[1],
    milestone: REVIEW_SESSION_CERTIFIED_REFERRED_MILESTONE_ID,
    name: 'ZC - Land Use Application Filed Review ',
    milestonename: 'Land Use Application Filed Review',
    plannedstartdate: '2018-11-03T01:21:46',
    plannedcompletiondate: '2018-12-03T02:21:46',
    actualstartdate: null,
    actualenddate: null,
    statuscode: 'Overridden',
    milestonesequence: 29,
    displayName: 'Land Use Application Filed Review',
    displayDate: '2018-11-03T01:21:46',
    displayDate2: null,
    milestoneoutcome: 'Multiple Borough President Recommendations',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  // This milestone is what makes seedCBUserProjects[1] "Upcoming"
  server.create('milestone', {
    project: seedCBUserProjects[1],
    milestone: COMMUNITY_BOARD_REFERRAL_MILESTONE_ID,
    name: 'ZC - Community Board Referral',
    milestonename: 'Community Board Referral',
    displayName: 'Community Board Referral',
    plannedstartdate: '2018-10-31T01:21:46',
    plannedcompletiondate: '2018-11-02T01:21:46',
    actualstartdate: null,
    actualenddate: null,
    statuscode: 'Not Started',
    milestonesequence: 28,
    displayDate: '2018-10-31T01:21:46',
    displayDate2: null,
    milestoneoutcome: 'Multiple Borough President Recommendations',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  // - Projects in the "To Review" bin
  server.create('milestone', {
    project: seedCBUserProjects[2],
    milestone: COMMUNITY_BOARD_REFERRAL_MILESTONE_ID,
    name: 'ZC - Community Board Referral',
    milestonename: 'Community Board Referral',
    displayName: 'Community Board Referral',
    plannedstartdate: '2018-08-15T01:21:46',
    plannedcompletiondate: '2018-10-15T01:21:46',
    actualstartdate: '2018-08-15T01:21:46',
    actualenddate: null,
    statuscode: 'In Progress',
    milestonesequence: 36,
    displayDate: '2018-08-15T01:21:46',
    displayDate2: null,
    milestoneoutcome: 'Multiple Borough President Recommendations',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', {
    project: seedCBUserProjects[3],
    milestone: COMMUNITY_BOARD_REFERRAL_MILESTONE_ID,
    name: 'ZC - Community Board Referral',
    milestonename: 'Community Board Referral',
    displayName: 'Community Board Referral',
    plannedstartdate: '2018-08-15T01:21:46',
    plannedcompletiondate: '2018-10-15T01:21:46',
    actualstartdate: '2018-08-15T01:21:46',
    actualenddate: null,
    statuscode: 'In Progress',
    milestonesequence: 36,
    displayDate: '2018-08-15T01:21:46',
    displayDate2: null,
    milestoneoutcome: 'Multiple Borough President Recommendations',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', {
    project: seedCBUserProjects[4],
    milestone: COMMUNITY_BOARD_REFERRAL_MILESTONE_ID,
    name: 'ZC - Community Board Referral',
    milestonename: 'Community Board Referral',
    displayName: 'Community Board Referral',
    plannedstartdate: '2018-08-15T01:21:46',
    plannedcompletiondate: '2018-10-15T01:21:46',
    actualstartdate: '2018-08-15T01:21:46',
    actualenddate: '2019-09-15T01:21:46',
    statuscode: 'In Progress',
    milestonesequence: 36,
    displayDate: '2018-08-15T01:21:46',
    displayDate2: '2019-09-15T01:21:46',
    milestoneoutcome: 'Multiple Borough President Recommendations',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  // - Projects in the "Reviewed" bin
  server.create('milestone', {
    project: seedCBUserProjects[5],
    milestone: CITY_COUNCIL_REVIEW_MILESTONE_ID,
    name: 'ZC - City Council Review ',
    milestonename: 'City Council Review',
    plannedstartdate: null,
    plannedcompletiondate: null,
    actualstartdate: '2016-04-22T01:40:24',
    actualenddate: '2022-05-02T01:40:24',
    statuscode: 'Not Started',
    milestonesequence: 60,
    displayName: 'City Council Review',
    displayDate: null,
    displayDate2: null,
    milestoneoutcome: 'Multiple Borough President Recommendations',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  // This milestone is what makes seedCBUserProjects[0] "Reviewed"
  server.create('milestone', {
    project: seedCBUserProjects[5],
    milestone: COMMUNITY_BOARD_REFERRAL_MILESTONE_ID,
    name: 'ZC - Community Board Referral',
    milestonename: 'Community Board Referral',
    displayName: 'Community Board Referral',
    plannedstartdate: '2018-10-31T01:21:46',
    plannedcompletiondate: '2018-11-02T01:21:46',
    actualstartdate: null,
    actualenddate: null,
    statuscode: 'Completed',
    milestonesequence: 28,
    displayDate: '2018-10-31T01:21:46',
    displayDate2: null,
    milestoneoutcome: 'Multiple Borough President Recommendations',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', {
    project: seedCBUserProjects[6],
    milestone: FINAL_LETTER_SENT_MILESTONE_ID,
    name: 'ZC - Final Letter Sent ',
    milestonename: 'Final Letter Sent',
    plannedstartdate: '2018-04-22T01:40:24',
    plannedcompletiondate: '2018-05-02T01:40:24',
    actualstartdate: null,
    actualenddate: null,
    statuscode: 'Not Started',
    milestonesequence: 60,
    displayName: 'Final Letter Sent',
    displayDate: null,
    displayDate2: null,
    milestoneoutcome: 'Multiple Borough President Recommendations',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  // This milestone is what makes seedCBUserProjects[0] "Reviewed"
  server.create('milestone', {
    project: seedCBUserProjects[6],
    milestone: COMMUNITY_BOARD_REFERRAL_MILESTONE_ID,
    name: 'ZC - Community Board Referral',
    milestonename: 'Community Board Referral',
    displayName: 'Community Board Referral',
    plannedstartdate: '2018-10-31T01:21:46',
    plannedcompletiondate: '2018-11-02T01:21:46',
    actualstartdate: null,
    actualenddate: null,
    statuscode: 'Completed',
    milestonesequence: 28,
    displayDate: '2018-10-31T01:21:46',
    displayDate2: null,
    milestoneoutcome: 'Multiple Borough President Recommendations',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  // For a BP participantType....
  // - BP Projects in the "Upcoming" bin to milestone
  server.create('milestone', {
    project: seedBPUserProjects[0],
    milestone: REVIEW_SESSION_CERTIFIED_REFERRED_MILESTONE_ID,
    name: 'ZC - Land Use Fee Payment ',
    milestonename: 'Land Use Fee Payment',
    plannedstartdate: '2018-10-31T01:21:46',
    plannedcompletiondate: '2018-11-02T01:21:46',
    actualstartdate: null,
    actualenddate: null,
    statuscode: 'Completed',
    milestonesequence: 28,
    displayName: 'Land Use Fee Payment',
    displayDate: '2018-10-31T01:21:46',
    displayDate2: null,
    milestoneoutcome: 'Multiple Borough President Recommendations',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });
  // - BP Projects in the "To Review" bin
  server.create('milestone', {
    project: seedBPUserProjects[1],
    milestone: BOROUGH_PRESIDENT_REFERRAL_MILESTONE_ID,
    name: 'ZC - Borough President Referral',
    milestonename: 'Borough President Referral',
    plannedstartdate: '2018-08-15T01:21:46',
    plannedcompletiondate: '2018-10-15T01:21:46',
    actualstartdate: '2018-08-15T01:21:46',
    actualenddate: null,
    statuscode: 'In Progress',
    milestonesequence: 36,
    displayName: 'Borough President Referral',
    displayDate: '2018-08-15T01:21:46',
    displayDate2: null,
    milestoneoutcome: 'Multiple Borough President Recommendations',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  server.create('milestone', {
    project: seedBPUserProjects[2],
    milestone: BOROUGH_PRESIDENT_REFERRAL_MILESTONE_ID,
    name: 'ZC - Borough President Referral',
    milestonename: 'Borough President Referral',
    plannedstartdate: '2018-08-15T01:21:46',
    plannedcompletiondate: '2018-10-15T01:21:46',
    actualstartdate: '2018-08-15T01:21:46',
    actualenddate: null,
    statuscode: 'In Progress',
    milestonesequence: 36,
    displayName: 'Borough President Referral',
    displayDate: '2018-08-15T01:21:46',
    displayDate2: null,
    milestoneoutcome: 'Multiple Borough President Recommendations',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });

  // - Projects in the "Reviewed" bin
  server.create('milestone', {
    project: seedBPUserProjects[3],
    milestone: CITY_COUNCIL_REVIEW_MILESTONE_ID,
    name: 'ZC - City Council Review ',
    milestonename: 'City Council Review',
    plannedstartdate: null,
    plannedcompletiondate: null,
    actualstartdate: '2016-04-22T01:40:24',
    actualenddate: '2022-05-02T01:40:24',
    statuscode: 'Not Started',
    milestonesequence: 60,
    displayName: 'City Council Review',
    displayDate: null,
    displayDate2: null,
    milestoneoutcome: 'Multiple Borough President Recommendations',
    milestoneLinks: [{
      filename: '2020_QB.pdf',
      url: 'https://www1.nyc.gov/site/planning/index.page',
    }],
  });
}
