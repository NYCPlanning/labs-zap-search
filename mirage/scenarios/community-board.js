import moment from 'moment';

const createDateInPast = function(count, timeUnit = 'days') {
  return moment().subtract(count, timeUnit);
};

const createDateFromNow = function(count, timeUnit = 'days') {
  return moment().add(count, timeUnit);
};

export default function(server) {
  // Array of dispositions for To Review Project 1

  server.create('user', {
    assignments: [

      // UPCOMING
      //----------------------------------------

      // Upcoming Project 1: pre-cert  >30
      server.create('assignment', {
        tab: 'upcoming',
        dcpLupteammemberrole: 'CB',
        publicReviewPlannedStartDate: createDateFromNow(42, 'days'),
        project: server.create('project', 'withActions', {
          dcpPublicstatusSimp: 'Filed',
          milestones: [
            server.create('milestone', 'prepareFiledLandUseApplication', {
              statuscode: 'Completed',
              dcpPlannedstartdate: createDateInPast(60, 'days'),
              displayDate: createDateInPast(60, 'days'),
              displayDate2: createDateInPast(60, 'days'),
              dcpActualenddate: createDateInPast(60, 'days'),
              outcome: null,
            }),
            server.create('milestone', 'certifiedReferred', {
              statuscode: 'Not Started',
            }),
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Not Started',
              dcpPlannedstartdate: createDateFromNow(42, 'days'),
            }),
          ],
        }),
      }),
      // Upcoming Project 2: pre-cert  <30
      server.create('assignment', {
        tab: 'upcoming',
        dcpLupteammemberrole: 'CB',
        publicReviewPlannedStartDate: createDateFromNow(12, 'days'),
        project: server.create('project', 'withActions', {
          dcpPublicstatusSimp: 'Filed',
          milestones: [
            server.create('milestone', 'prepareFiledLandUseApplication', {
              statuscode: 'Completed',
              dcpPlannedstartdate: createDateInPast(75, 'days'),
              displayDate: createDateInPast(75, 'days'),
              displayDate2: createDateInPast(75, 'days'),
              dcpActualenddate: createDateInPast(75, 'days'),
              outcome: null,
            }),
            server.create('milestone', 'certifiedReferred', {
              statuscode: 'Not Started',
            }),
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Not Started',
              dcpPlannedstartdate: createDateFromNow(12, 'days'),
            }),
          ],
        }),
      }),

      // TO REVIEW
      //----------------------------------------

      // To Review Project 1: CB
      server.create('assignment', {
        tab: 'to-review',
        dcpLupteammemberrole: 'CB',
        project: server.create('project', 'withActions', {
          id: 3,
          dcpPublicstatusSimp: 'In Public Review',
          dispositions: server.createList('disposition', 4, 'forCommunityBoard'),
          milestones: [
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'In Progress',
              dcpActualstartdate: createDateInPast(2, 'days'),
              displayDate: createDateInPast(2, 'days'),
              displayDate2: null,
              dcpPlannedcompletiondate: createDateFromNow(58, 'days'),
              outcome: null,
            }),
          ],
        }),
        dispositions: server.schema.dispositions.where({ projectId: 3 }),
      }),
      // To Review Project 2: CB
      server.create('assignment', {
        tab: 'to-review',
        dcpLupteammemberrole: 'CB',

        project: server.create('project', 'withActions', {
          id: 4,
          dcpPublicstatusSimp: 'In Public Review',
          dispositions: server.createList('disposition', 4, 'forCommunityBoard'),
          milestones: [
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'In Progress',
              dcpActualstartdate: createDateInPast(35, 'days'),
              displayDate: createDateInPast(35, 'days'),
              displayDate2: null,
              dcpPlannedcompletiondate: createDateFromNow(25, 'days'),
              outcome: null,
            }),
          ],
        }),
        dispositions: server.schema.dispositions.where({ projectId: 4 }),
      }),

      // REVIEWED
      //----------------------------------------

      // Reviewed Project 1: CB Approved w/ Mod, CB Disapproved, BP Approved, CPC Review
      server.create('assignment', {
        tab: 'reviewed',
        dcpLupteammemberrole: 'CB',
        project: server.create('project', 'withActions', {
          dcpPublicstatusSimp: 'In Public Review',
          dispositions: [
            server.create('disposition', 'withAction', {
              fullname: 'QN BP',
              dcpBoroughpresidentrecommendation: 'Approved',
              dcpDatereceived: createDateInPast(90, 'days'),
            }),
            server.create('disposition', 'withAction', {
              fullname: 'QN CB4',
              dcpCommunityboardrecommendation: 'Approved with Modifications/Conditions',
              dcpDatereceived: createDateInPast(120, 'days'),
            }),
            server.create('disposition', 'withAction', {
              fullname: 'QN CB6',
              dcpCommunityboardrecommendation: 'Disapproved',
              dcpDatereceived: createDateInPast(130, 'days'),
            }),
          ],
          milestones: [
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(180, 'days'),
              displayDate: createDateInPast(180, 'days'),
              dcpActualenddate: createDateInPast(120, 'days'),
              displayDate2: createDateInPast(120, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(120, 'days'),
              displayDate: createDateInPast(120, 'days'),
              dcpActualenddate: createDateInPast(90, 'days'),
              displayDate2: createDateInPast(90, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionReview', {
              statuscode: 'In Progress',
              dcpActualstartdate: createDateInPast(10, 'days'),
              displayDate: createDateInPast(10, 'days'),
              dcpPlannedcompletiondate: createDateFromNow(10, 'days'),
              displayDate2: createDateFromNow(10, 'days'),
            }),

            server.create('milestone', 'cityPlanningCommissionVote', {
              statuscode: 'Not Started',
            }),

            server.create('milestone', 'cityCouncilReview', {
              statuscode: 'Not Started',
            }),

            server.create('milestone', 'mayoralReview', {
              statuscode: 'Not Started',
            }),

            server.create('milestone', 'finalLetterSent', {
              statuscode: 'Not Started',
            }),
          ],
        }),
      }),
      // Reviewed Project 2: CB Approved w/ Mod, BP Approved, City Council Review
      server.create('assignment', {
        tab: 'reviewed',
        dcpLupteammemberrole: 'CB',
        project: server.create('project', 'withActions', {
          dcpPublicstatusSimp: 'In Public Review',
          dispositions: [
            server.create('disposition', 'withAction', {
              fullname: 'QN BP',
              dcpBoroughpresidentrecommendation: 'Approved',
              dcpDatereceived: createDateInPast(82, 'days'),
            }),
            server.create('disposition', 'withAction', {
              fullname: 'QN CB9',
              dcpCommunityboardrecommendation: 'Approved with Modifications/Conditions',
              dcpDatereceived: createDateInPast(130, 'days'),
            }),
          ],
          milestones: [
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(160, 'days'),
              displayDate: createDateInPast(160, 'days'),
              dcpActualenddate: createDateInPast(130, 'days'),
              displayDate2: createDateInPast(130, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(130, 'days'),
              displayDate: createDateInPast(130, 'days'),
              dcpActualenddate: createDateInPast(82, 'days'),
              displayDate2: createDateInPast(82, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(82, 'days'),
              displayDate: createDateInPast(82, 'days'),
              dcpActualenddate: createDateInPast(47, 'days'),
              displayDate2: createDateInPast(47, 'days'),
              outcome: 'Hearing Closed',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionVote', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(46, 'days'),
              displayDate: createDateInPast(46, 'days'),
              dcpActualenddate: createDateInPast(16, 'days'),
              displayDate2: createDateInPast(16, 'days'),
              outcome: 'Approval',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityCouncilReview', {
              statuscode: 'In Progress',
              dcpActualstartdate: createDateInPast(15, 'days'),
              displayDate: createDateInPast(15, 'days'),
              dcpPlannedcompletiondate: createDateFromNow(15, 'days'),
              displayDate2: createDateFromNow(15, 'days'),
            }),

            server.create('milestone', 'mayoralReview', {
              statuscode: 'Not Started',
            }),

            server.create('milestone', 'finalLetterSent', {
              statuscode: 'Not Started',
            }),
          ],
        }),
      }),
      // Reviewed Project 3: CB Waived, BP Approved, Mayoral Review
      server.create('assignment', {
        tab: 'reviewed',
        dcpLupteammemberrole: 'CB',
        project: server.create('project', 'withActions', {
          dcpPublicstatusSimp: 'In Public Review',
          dispositions: [
            server.create('disposition', 'withAction', {
              fullname: 'QN BP',
              dcpBoroughpresidentrecommendation: 'Approved',
              dcpDatereceived: createDateInPast(120, 'days'),
            }),
            server.create('disposition', 'withAction', {
              fullname: 'QN CB12',
              dcpCommunityboardrecommendation: 'Waived',
              dcpDatereceived: createDateInPast(120, 'days'),
            }),
          ],
          milestones: [
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(180, 'days'),
              displayDate: createDateInPast(180, 'days'),
              dcpActualenddate: createDateInPast(120, 'days'),
              displayDate2: createDateInPast(120, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(120, 'days'),
              displayDate: createDateInPast(120, 'days'),
              dcpActualenddate: createDateInPast(90, 'days'),
              displayDate2: createDateInPast(90, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(90, 'days'),
              displayDate: createDateInPast(90, 'days'),
              dcpActualenddate: createDateInPast(71, 'days'),
              displayDate2: createDateInPast(71, 'days'),
              outcome: 'Hearing Closed',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionVote', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(70, 'days'),
              displayDate: createDateInPast(70, 'days'),
              dcpActualenddate: createDateInPast(61, 'days'),
              displayDate2: createDateInPast(61, 'days'),
              outcome: 'Approval',
            }),

            server.create('milestone', 'cityCouncilReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(60, 'days'),
              displayDate: createDateInPast(60, 'days'),
              dcpActualenddate: createDateInPast(30, 'days'),
              displayDate2: createDateInPast(30, 'days'),
              outcome: 'Approval',
            }),

            server.create('milestone', 'mayoralReview', {
              statuscode: 'In Progress',
              dcpActualstartdate: createDateInPast(30, 'days'),
              displayDate: createDateInPast(30, 'days'),
              dcpPlannedcompletiondate: createDateFromNow(8, 'days'),
              displayDate2: createDateFromNow(8, 'days'),
            }),

            server.create('milestone', 'finalLetterSent', {
              statuscode: 'Not Started',
            }),
          ],
        }),
      }),

      // ARCHIVE
      //----------------------------------------

      // Archive Project 1: Approved
      server.create('assignment', {
        tab: 'archive',
        dcpLupteammemberrole: 'CB',
        project: server.create('project', 'withActions', {
          dcpPublicstatus: 'Approved',
          dcpPublicstatusSimp: 'Completed',
          dcpProjectcompleted: createDateInPast(40, 'days'),
          dispositions: [
            server.create('disposition', 'withAction', {
              fullname: 'QN BP',
              dcpBoroughpresidentrecommendation: 'Approved',
              dcpDatereceived: createDateInPast(90, 'days'),
            }),
            server.create('disposition', 'withAction', {
              fullname: 'QN CB4',
              dcpCommunityboardrecommendation: 'Approved with Modifications/Conditions',
              dcpDatereceived: createDateInPast(120, 'days'),
            }),
            server.create('disposition', 'withAction', {
              fullname: 'QN CB6',
              dcpCommunityboardrecommendation: 'Disapproved',
              dcpDatereceived: createDateInPast(130, 'days'),
            }),
          ],
          milestones: [
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(180, 'days'),
              displayDate: createDateInPast(180, 'days'),
              dcpActualenddate: createDateInPast(120, 'days'),
              displayDate2: createDateInPast(120, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(120, 'days'),
              displayDate: createDateInPast(120, 'days'),
              dcpActualenddate: createDateInPast(110, 'days'),
              displayDate2: createDateInPast(110, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(110, 'days'),
              displayDate: createDateInPast(110, 'days'),
              dcpActualenddate: createDateInPast(90, 'days'),
              displayDate2: createDateInPast(90, 'days'),
            }),

            server.create('milestone', 'cityPlanningCommissionVote', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(110, 'days'),
              displayDate: createDateInPast(110, 'days'),
              dcpActualenddate: createDateInPast(90, 'days'),
              displayDate2: createDateInPast(90, 'days'),
            }),

            server.create('milestone', 'cityCouncilReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(90, 'days'),
              displayDate: createDateInPast(90, 'days'),
              dcpActualenddate: createDateInPast(60, 'days'),
              displayDate2: createDateInPast(60, 'days'),
            }),

            server.create('milestone', 'mayoralReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(60, 'days'),
              displayDate: createDateInPast(60, 'days'),
              dcpActualenddate: createDateInPast(50, 'days'),
              displayDate2: createDateInPast(50, 'days'),
            }),

            server.create('milestone', 'finalLetterSent', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(40, 'days'),
              displayDate: createDateInPast(40, 'days'),
              dcpActualenddate: createDateInPast(40, 'days'),
              displayDate2: createDateInPast(40, 'days'),
            }),
          ],
        }),
      }),
      // Archive Project 2: Approved
      server.create('assignment', {
        tab: 'archive',
        dcpLupteammemberrole: 'CB',
        project: server.create('project', 'withActions', {
          dcpPublicstatus: 'Approved',
          dcpPublicstatusSimp: 'Completed',
          dcpProjectcompleted: createDateInPast(140, 'days'),
          dispositions: [
            server.create('disposition', 'withAction', {
              fullname: 'QN BP',
              dcpBoroughpresidentrecommendation: 'Approved',
              dcpDatereceived: createDateInPast(290, 'days'),
            }),
            server.create('disposition', 'withAction', {
              fullname: 'QN CB9',
              dcpCommunityboardrecommendation: 'Approved with Modifications/Conditions',
              dcpDatereceived: createDateInPast(320, 'days'),
            }),
          ],
          milestones: [
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(380, 'days'),
              displayDate: createDateInPast(380, 'days'),
              dcpActualenddate: createDateInPast(320, 'days'),
              displayDate2: createDateInPast(320, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(320, 'days'),
              displayDate: createDateInPast(320, 'days'),
              dcpActualenddate: createDateInPast(290, 'days'),
              displayDate2: createDateInPast(290, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(290, 'days'),
              displayDate: createDateInPast(290, 'days'),
              dcpActualenddate: createDateInPast(210, 'days'),
              displayDate2: createDateInPast(210, 'days'),
            }),

            server.create('milestone', 'cityPlanningCommissionVote', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(210, 'days'),
              displayDate: createDateInPast(210, 'days'),
              dcpActualenddate: createDateInPast(190, 'days'),
              displayDate2: createDateInPast(190, 'days'),
            }),

            server.create('milestone', 'cityCouncilReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(190, 'days'),
              displayDate: createDateInPast(190, 'days'),
              dcpActualenddate: createDateInPast(160, 'days'),
              displayDate2: createDateInPast(160, 'days'),
            }),

            server.create('milestone', 'mayoralReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(160, 'days'),
              displayDate: createDateInPast(160, 'days'),
              dcpActualenddate: createDateInPast(150, 'days'),
              displayDate2: createDateInPast(150, 'days'),
            }),

            server.create('milestone', 'finalLetterSent', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(140, 'days'),
              displayDate: createDateInPast(140, 'days'),
              dcpActualenddate: createDateInPast(140, 'days'),
              displayDate2: createDateInPast(140, 'days'),
            }),
          ],
        }),
      }),
      // Archive Project 3: Withdrawn
      server.create('assignment', {
        tab: 'archive',
        dcpLupteammemberrole: 'CB',
        project: server.create('project', 'withActions', {
          dcpPublicstatus: 'Withdrawn/Terminated/Disapproved',
          dcpPublicstatusSimp: 'Completed',
          dcpProjectcompleted: createDateInPast(120, 'days'),
          dispositions: [
            server.create('disposition', 'withAction', {
              fullname: 'QN BP',
              dcpBoroughpresidentrecommendation: 'Approved',
              dcpDatereceived: createDateInPast(120, 'days'),
            }),
            server.create('disposition', 'withAction', {
              fullname: 'QN CB12',
              dcpCommunityboardrecommendation: 'Waived',
              dcpDatereceived: createDateInPast(120, 'days'),
            }),
          ],
          milestones: [
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(180, 'days'),
              displayDate: createDateInPast(180, 'days'),
              dcpActualenddate: createDateInPast(120, 'days'),
              displayDate2: createDateInPast(120, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(120, 'days'),
              displayDate: createDateInPast(120, 'days'),
              dcpActualenddate: createDateInPast(90, 'days'),
              displayDate2: createDateInPast(90, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(90, 'days'),
              displayDate: createDateInPast(90, 'days'),
              dcpActualenddate: createDateInPast(71, 'days'),
              displayDate2: createDateInPast(71, 'days'),
              outcome: 'Hearing Closed',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionVote', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(70, 'days'),
              displayDate: createDateInPast(70, 'days'),
              dcpActualenddate: createDateInPast(61, 'days'),
              outcome: 'Approval',
            }),

            server.create('milestone', 'cityCouncilReview', {
              statuscode: 'Completed',
              dcpActualstartdate: createDateInPast(160, 'days'),
              displayDate: createDateInPast(160, 'days'),
              dcpActualenddate: createDateInPast(130, 'days'),
              displayDate2: createDateInPast(130, 'days'),
              outcome: 'Disapproved',
            }),

            server.create('milestone', 'mayoralReview', {
              statuscode: 'Not Started',
            }),

            server.create('milestone', 'finalLetterSent', {
              statuscode: 'Not Started',
            }),
          ],
        }),
      }),
    ],
  });
}
