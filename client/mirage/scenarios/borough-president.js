import moment from 'moment';

export default function(server) {
  // Array of dispositions for To Review Project 1
  const dispositionsArrayForToReview = [
    server.create('disposition', {
      fullname: 'QN CB4',
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
      dcpDateofpublichearing: null,
      dcpDatereceived: null,
      dcpPublichearinglocation: null,
    }),
    server.create('disposition', {
      fullname: 'QN CB4',
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
      dcpDateofpublichearing: null,
      dcpDatereceived: null,
      dcpPublichearinglocation: null,
    }),
    server.create('disposition', {
      fullname: 'QN CB4',
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
      dcpDateofpublichearing: null,
      dcpDatereceived: null,
      dcpPublichearinglocation: null,
    }),
  ];

  // Array of dispositions for To Review Project 2 BP role
  const dispositionsArrayForToReview2 = [
    server.create('disposition', {
      fullname: 'QN CB4',
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
      dcpDateofpublichearing: null,
      dcpDatereceived: null,
      dcpPublichearinglocation: null,
    }),
    server.create('disposition', {
      fullname: 'QN CB4',
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
      dcpDateofpublichearing: null,
      dcpDatereceived: null,
      dcpPublichearinglocation: null,
    }),
    server.create('disposition', {
      fullname: 'QN CB4',
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
      dcpDateofpublichearing: null,
      dcpDatereceived: null,
      dcpPublichearinglocation: null,
    }),
  ];

  // Array of dispositions for To Review Project 2 BB role
  const dispositionsArrayForToReview3 = [
    server.create('disposition', {
      fullname: 'QN CB4',
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
      dcpDateofpublichearing: null,
      dcpDatereceived: null,
      dcpPublichearinglocation: null,
    }),
    server.create('disposition', {
      fullname: 'QN CB4',
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
      dcpDateofpublichearing: null,
      dcpDatereceived: null,
      dcpPublichearinglocation: null,
    }),
    server.create('disposition', {
      fullname: 'QN CB4',
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
      dcpDateofpublichearing: null,
      dcpDatereceived: null,
      dcpPublichearinglocation: null,
    }),
  ];

  // Project attributes for Upcoming Project 1 which has both BP and BB assignments
  const projectForUpcoming1 = server.create('project', 'withActions', {
    dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
    dcpPublicstatusSimp: 'Filed',
    dispositions: [
      server.create('disposition', {
        fullname: 'QN BP',
        dcpBoroughpresidentrecommendation: null,
        dcpDatereceived: null,
      }),
    ],
    milestones: [
      server.create('milestone', 'prepareFiledLandUseApplication', {
        statuscode: 'Completed',
        dcpPlannedstartdate: moment().subtract(60, 'days'),
        dcpActualenddate: moment().subtract(60, 'days'),
        outcome: null,
      }),
      server.create('milestone', 'certifiedReferred', {
        statuscode: 'Not Started',
      }),
      server.create('milestone', 'communityBoardReview', {
        statuscode: 'Not Started',
        dcpPlannedstartdate: moment().add(42, 'days'),
      }),
      server.create('milestone', 'boroughPresidentReview', {
        statuscode: 'Not Started',
      }),
      server.create('milestone', 'boroughBoardReview', {
        statuscode: 'Not Started',
      }),
    ],
  });

  const projectForToReview2 = server.create('project', 'withActions', {
    dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
    dcpPublicstatusSimp: 'In Public Review',
    dispositions: dispositionsArrayForToReview2,
    milestones: [
      server.create('milestone', 'boroughPresidentReview', {
        statuscode: 'In Progress',
        dcpActualstartdate: moment().subtract(2, 'days'),
        dcpPlannedcompletiondate: moment().add(28, 'days'),
        outcome: null,
      }),
    ],
  });

  server.create('user', {
    assignments: [

      // UPCOMING
      //----------------------------------------

      // Upcoming Project 1A: BP role for pre-cert with BP & BB roles >30
      server.create('assignment', {
        tab: 'upcoming',
        dcpLupteammemberrole: 'BP',
        publicReviewPlannedStartDate: moment().add(42, 'days'),
        project: projectForUpcoming1,
      }),

      // Upcoming Project 1B: BP role for pre-cert with BP & BB roles >30
      server.create('assignment', {
        tab: 'upcoming',
        dcpLupteammemberrole: 'BB',
        publicReviewPlannedStartDate: moment().add(42, 'days'),
        project: projectForUpcoming1,
      }),

      // Upcoming Project 2: pre-cert with BP role <30
      server.create('assignment', {
        tab: 'upcoming',
        dcpLupteammemberrole: 'BP',
        publicReviewPlannedStartDate: moment().add(12, 'days'),
        project: server.create('project', 'withActions', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatusSimp: 'Filed',
          dispositions: [
            server.create('disposition', {
              fullname: 'QN BP',
              dcpBoroughpresidentrecommendation: null,
              dcpDatereceived: null,
            }),
          ],
          milestones: [
            server.create('milestone', 'prepareFiledLandUseApplication', {
              statuscode: 'Completed',
              dcpPlannedstartdate: moment().subtract(80, 'days'),
              dcpActualenddate: moment().subtract(80, 'days'),
              outcome: null,
            }),
            server.create('milestone', 'certifiedReferred', {
              statuscode: 'Not Started',
            }),
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Not Started',
              dcpPlannedstartdate: moment().add(10, 'days'),
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Not Started',
            }),
          ],
        }),
      }),

      // Upcoming Project 3: post-cert with BP role
      server.create('assignment', {
        tab: 'upcoming',
        dcpLupteammemberrole: 'BP',
        publicReviewPlannedStartDate: moment().add(12, 'days'),
        project: server.create('project', 'withActions', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatusSimp: 'In Public Review',
          dispositions: [
            server.create('disposition', {
              fullname: 'QN BP',
              dcpBoroughpresidentrecommendation: null,
              dcpDatereceived: null,
            }),
          ],
          milestones: [
            server.create('milestone', 'prepareFiledLandUseApplication', {
              statuscode: 'Completed',
              dcpPlannedstartdate: moment().subtract(100, 'days'),
              dcpActualenddate: moment().subtract(100, 'days'),
              outcome: null,
            }),
            server.create('milestone', 'certifiedReferred', {
              statuscode: 'Completed',
              dcpActualenddate: moment().subtract(55, 'days'),
            }),
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'In Progress',
              dcpPlannedcompletiondate: moment().add(38, 'days'),
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Not Started',
              dcpPlannedstartdate: moment().add(38, 'days'),
            }),
          ],
        }),
      }),

      // TO REVIEW
      //----------------------------------------

      // To Review Project 1: BP role only
      server.create('assignment', {
        tab: 'to-review',
        dcpLupteammemberrole: 'BP',
        dispositions: dispositionsArrayForToReview,
        project: server.create('project', 'withActions', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatusSimp: 'In Public Review',
          dispositions: dispositionsArrayForToReview,
          milestones: [
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'In Progress',
              dcpActualstartdate: moment().subtract(20, 'days'),
              dcpPlannedcompletiondate: moment().add(10, 'days'),
              outcome: null,
            }),
          ],
        }),
      }),
      // To Review Project 2: BP role for project with both BP and BB roles
      server.create('assignment', {
        tab: 'to-review',
        dcpLupteammemberrole: 'BP',
        dispositions: dispositionsArrayForToReview2,
        project: server.create('project', 'withActions', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatusSimp: 'Filed',
          dispositions: [
            server.create('disposition', {
              fullname: 'QN BP',
              dcpBoroughpresidentrecommendation: null,
              dcpDatereceived: null,
            }),
          ],
          milestones: [
            server.create('milestone', 'prepareFiledLandUseApplication', {
              statuscode: 'Completed',
              dcpPlannedstartdate: moment().subtract(60, 'days'),
              dcpActualenddate: moment().subtract(60, 'days'),
              outcome: null,
            }),
            server.create('milestone', 'certifiedReferred', {
              statuscode: 'Not Started',
            }),
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Not Started',
              dcpPlannedstartdate: moment().add(42, 'days'),
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Not Started',
            }),
            server.create('milestone', 'boroughBoardReview', {
              statuscode: 'Not Started',
            }),
          ],
        }),
      }),
      // To Review Project 2: BB role for project with both BP and BB roles
      server.create('assignment', {
        tab: 'to-review',
        dcpLupteammemberrole: 'BB',
        dispositions: dispositionsArrayForToReview3,
        project: projectForToReview2,
      }),

      // REVIEWED
      //----------------------------------------

      // Reviewed Project 1: CB Conditional Favorable, CB Unfavorable, BP Favorable, CPC Review
      server.create('assignment', {
        tab: 'reviewed',
        dcpLupteammemberrole: 'CB',
        project: server.create('project', 'withActions', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatusSimp: 'In Public Review',
          dispositions: [
            server.create('disposition', {
              fullname: 'QN BP',
              dcpBoroughpresidentrecommendation: 'Favorable',
              dcpDatereceived: moment().subtract(90, 'days'),
            }),
            server.create('disposition', {
              fullname: 'QN CB4',
              dcpCommunityboardrecommendation: 'Conditional Favorable',
              dcpDatereceived: moment().subtract(120, 'days'),
            }),
            server.create('disposition', {
              fullname: 'QN CB6',
              dcpCommunityboardrecommendation: 'Unfavorable',
              dcpDatereceived: moment().subtract(130, 'days'),
            }),
          ],
          milestones: [
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(180, 'days'),
              dcpActualenddate: moment().subtract(120, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(120, 'days'),
              dcpActualenddate: moment().subtract(90, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionReview', {
              statuscode: 'In Progress',
              dcpActualstartdate: moment().subtract(10, 'days'),
              dcpPlannedcompletiondate: moment().add(10, 'days'),
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
      // Reviewed Project 2: CB Conditional Favorable, BP Favorable, City Council Review
      server.create('assignment', {
        tab: 'reviewed',
        dcpLupteammemberrole: 'CB',
        project: server.create('project', 'withActions', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatusSimp: 'In Public Review',
          dispositions: [
            server.create('disposition', {
              fullname: 'QN BP',
              dcpBoroughpresidentrecommendation: 'Favorable',
              dcpDatereceived: moment().subtract(82, 'days'),
            }),
            server.create('disposition', {
              fullname: 'QN CB9',
              dcpCommunityboardrecommendation: 'Conditional Favorable',
              dcpDatereceived: moment().subtract(130, 'days'),
            }),
          ],
          milestones: [
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(160, 'days'),
              dcpActualenddate: moment().subtract(130, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(130, 'days'),
              dcpActualenddate: moment().subtract(82, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(82, 'days'),
              dcpActualenddate: moment().subtract(47, 'days'),
              outcome: 'Hearing Closed',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionVote', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(46, 'days'),
              dcpActualenddate: moment().subtract(16, 'days'),
              outcome: 'Approval',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityCouncilReview', {
              statuscode: 'In Progress',
              dcpActualstartdate: moment().subtract(15, 'days'),
              dcpPlannedcompletiondate: moment().add(15, 'days'),
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
      // Reviewed Project 3: CB Waiver of Recommendation, BP Favorable, Mayoral Review
      server.create('assignment', {
        tab: 'reviewed',
        dcpLupteammemberrole: 'CB',
        project: server.create('project', 'withActions', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatusSimp: 'In Public Review',
          dispositions: [
            server.create('disposition', {
              fullname: 'QN BP',
              dcpBoroughpresidentrecommendation: 'Favorable',
              dcpDatereceived: moment().subtract(120, 'days'),
            }),
            server.create('disposition', {
              fullname: 'QN CB12',
              dcpCommunityboardrecommendation: 'Waiver of Recommendation',
              dcpDatereceived: moment().subtract(120, 'days'),
            }),
          ],
          milestones: [
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(180, 'days'),
              dcpActualenddate: moment().subtract(120, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(120, 'days'),
              dcpActualenddate: moment().subtract(90, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(90, 'days'),
              dcpActualenddate: moment().subtract(71, 'days'),
              outcome: 'Hearing Closed',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionVote', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(70, 'days'),
              dcpActualenddate: moment().subtract(61, 'days'),
              outcome: 'Approval',
            }),

            server.create('milestone', 'cityCouncilReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(60, 'days'),
              dcpActualenddate: moment().subtract(30, 'days'),
              outcome: 'Approval',
            }),

            server.create('milestone', 'mayoralReview', {
              statuscode: 'In Progress',
              dcpActualstartdate: moment().subtract(30, 'days'),
              dcpPlannedcompletiondate: moment().add(8, 'days'),
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
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatus: 'Approved',
          dcpPublicstatusSimp: 'Completed',
          dcpProjectcompleted: moment().subtract(40, 'days'),
          dispositions: [
            server.create('disposition', {
              fullname: 'QN BP',
              dcpBoroughpresidentrecommendation: 'Favorable',
              dcpDatereceived: moment().subtract(90, 'days'),
            }),
            server.create('disposition', {
              fullname: 'QN CB4',
              dcpCommunityboardrecommendation: 'Conditional Favorable',
              dcpDatereceived: moment().subtract(120, 'days'),
            }),
            server.create('disposition', {
              fullname: 'QN CB6',
              dcpCommunityboardrecommendation: 'Unfavorable',
              dcpDatereceived: moment().subtract(130, 'days'),
            }),
          ],
          milestones: [
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(180, 'days'),
              dcpActualenddate: moment().subtract(120, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(120, 'days'),
              dcpActualenddate: moment().subtract(110, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(110, 'days'),
              dcpActualenddate: moment().subtract(90, 'days'),
            }),

            server.create('milestone', 'cityPlanningCommissionVote', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(110, 'days'),
              dcpActualenddate: moment().subtract(90, 'days'),
            }),

            server.create('milestone', 'cityCouncilReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(90, 'days'),
              dcpActualenddate: moment().subtract(60, 'days'),
            }),

            server.create('milestone', 'mayoralReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(60, 'days'),
              dcpActualenddate: moment().subtract(50, 'days'),
            }),

            server.create('milestone', 'finalLetterSent', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(40, 'days'),
              dcpActualenddate: moment().subtract(40, 'days'),
            }),
          ],
        }),
      }),
      // Archive Project 2: Approved
      server.create('assignment', {
        tab: 'archive',
        dcpLupteammemberrole: 'CB',
        project: server.create('project', 'withActions', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatus: 'Approved',
          dcpPublicstatusSimp: 'Completed',
          dcpProjectcompleted: moment().subtract(140, 'days'),
          dispositions: [
            server.create('disposition', {
              fullname: 'QN BP',
              dcpBoroughpresidentrecommendation: 'Favorable',
              dcpDatereceived: moment().subtract(290, 'days'),
            }),
            server.create('disposition', {
              fullname: 'QN CB9',
              dcpCommunityboardrecommendation: 'Conditional Favorable',
              dcpDatereceived: moment().subtract(320, 'days'),
            }),
          ],
          milestones: [
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(380, 'days'),
              dcpActualenddate: moment().subtract(320, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(320, 'days'),
              dcpActualenddate: moment().subtract(290, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(290, 'days'),
              dcpActualenddate: moment().subtract(210, 'days'),
            }),

            server.create('milestone', 'cityPlanningCommissionVote', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(210, 'days'),
              dcpActualenddate: moment().subtract(190, 'days'),
            }),

            server.create('milestone', 'cityCouncilReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(190, 'days'),
              dcpActualenddate: moment().subtract(160, 'days'),
            }),

            server.create('milestone', 'mayoralReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(160, 'days'),
              dcpActualenddate: moment().subtract(150, 'days'),
            }),

            server.create('milestone', 'finalLetterSent', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(140, 'days'),
              dcpActualenddate: moment().subtract(140, 'days'),
            }),
          ],
        }),
      }),
      // Archive Project 3: Withdrawn
      server.create('assignment', {
        tab: 'archive',
        dcpLupteammemberrole: 'CB',
        project: server.create('project', 'withActions', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatus: 'Withdrawn/Terminated/Disapproved',
          dcpPublicstatusSimp: 'Completed',
          dcpProjectcompleted: moment().subtract(120, 'days'),
          dispositions: [
            server.create('disposition', {
              fullname: 'QN BP',
              dcpBoroughpresidentrecommendation: 'Favorable',
              dcpDatereceived: moment().subtract(120, 'days'),
            }),
            server.create('disposition', {
              fullname: 'QN CB12',
              dcpCommunityboardrecommendation: 'Waiver of Recommendation',
              dcpDatereceived: moment().subtract(120, 'days'),
            }),
          ],
          milestones: [
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(180, 'days'),
              dcpActualenddate: moment().subtract(120, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(120, 'days'),
              dcpActualenddate: moment().subtract(90, 'days'),
              outcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(90, 'days'),
              dcpActualenddate: moment().subtract(71, 'days'),
              outcome: 'Hearing Closed',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionVote', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(70, 'days'),
              dcpActualenddate: moment().subtract(61, 'days'),
              outcome: 'Approval',
            }),

            server.create('milestone', 'cityCouncilReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(160, 'days'),
              dcpActualenddate: moment().subtract(130, 'days'),
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
