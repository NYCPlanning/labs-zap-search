import moment from 'moment';

export default function(server) {
  // Array of dispositions for To Review Project 1
  const dispositionsArray = [
    server.create('disposition', 'withAction', {
      dcpRecommendationsubmittedbyname: 'QNCB4',
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
      dcpDateofpublichearing: null,
      dcpDatereceived: null,
      dcpPublichearinglocation: null,
    }),
    server.create('disposition', 'withAction', {
      dcpRecommendationsubmittedbyname: 'QNCB4',
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
      dcpDateofpublichearing: null,
      dcpDatereceived: null,
      dcpPublichearinglocation: null,
    }),
    server.create('disposition', 'withAction', {
      dcpRecommendationsubmittedbyname: 'QNCB4',
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
      dcpDateofpublichearing: null,
      dcpDatereceived: null,
      dcpPublichearinglocation: null,
    }),
  ];

  // Array of dispositions for To Review Project 2 BP role
  const dispositionsArray2 = [
    server.create('disposition', 'withAction', {
      dcpRecommendationsubmittedbyname: 'QNCB4',
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
      dcpDateofpublichearing: null,
      dcpDatereceived: null,
      dcpPublichearinglocation: null,
    }),
    server.create('disposition', 'withAction', {
      dcpRecommendationsubmittedbyname: 'QNCB4',
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
      dcpDateofpublichearing: null,
      dcpDatereceived: null,
      dcpPublichearinglocation: null,
    }),
    server.create('disposition', 'withAction', {
      dcpRecommendationsubmittedbyname: 'QNCB4',
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
      dcpDateofpublichearing: null,
      dcpDatereceived: null,
      dcpPublichearinglocation: null,
    }),
  ];

  // Array of dispositions for To Review Project 2 BB role
  const dispositionsArray3 = [
    server.create('disposition', 'withAction', {
      dcpRecommendationsubmittedbyname: 'QNCB4',
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
      dcpDateofpublichearing: null,
      dcpDatereceived: null,
      dcpPublichearinglocation: null,
    }),
    server.create('disposition', 'withAction', {
      dcpRecommendationsubmittedbyname: 'QNCB4',
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
      dcpDateofpublichearing: null,
      dcpDatereceived: null,
      dcpPublichearinglocation: null,
    }),
    server.create('disposition', 'withAction', {
      dcpRecommendationsubmittedbyname: 'QNCB4',
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
      dcpDateofpublichearing: null,
      dcpDatereceived: null,
      dcpPublichearinglocation: null,
    }),
  ];

  server.create('user', {
    assignments: [

      // UPCOMING
      //----------------------------------------

      // Upcoming Project 1: pre-cert with BP & BB roles >30
      server.create('assignment', {
        tab: 'upcoming',
        dcpLupteammemberrole: 'BP',
        dcpPublicstatusSimp: 'Filed',
        publicReviewPlannedStartDate: moment().add(42, 'days'),
        project: server.create('project', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatus: 'Filed',
          dispositions: [
            server.create('disposition', 'withAction', {
              dcpRecommendationsubmittedbyname: 'QNBP',
              dcpBoroughpresidentrecommendation: null,
              dcpDatereceived: null,
            }),
          ],
          milestones: [
            server.create('milestone', 'prepareFiledLandUseApplication', {
              statuscode: 'Completed',
              dcpPlannedstartdate: moment().subtract(60, 'days'),
              displayDate: moment().subtract(60, 'days'),
              displayDate2: moment().subtract(60, 'days'),
              dcpActualenddate: moment().subtract(60, 'days'),
              dcpMilestoneoutcome: null,
            }),
            server.create('milestone', 'certifiedReferred', {
              statuscode: 'Not Started',
            }),
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Not Started',
              dcpPlannedstartdate: moment().add(42, 'days'),
              displayDate: moment().add(42, 'days'),
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Not Started',
            }),
          ],
        }),
      }),
      // Upcoming Project 2: pre-cert with BP & BB roles <30
      server.create('assignment', {
        tab: 'upcoming',
        dcpLupteammemberrole: 'BP',
        dcpPublicstatusSimp: 'In Public Review',
        publicReviewPlannedStartDate: moment().add(12, 'days'),
        project: server.create('project', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatus: 'Filed',
          dispositions: [
            server.create('disposition', 'withAction', {
              dcpRecommendationsubmittedbyname: 'QNBP',
              dcpBoroughpresidentrecommendation: null,
              dcpDatereceived: null,
            }),
          ],
          milestones: [
            server.create('milestone', 'prepareFiledLandUseApplication', {
              statuscode: 'Completed',
              dcpPlannedstartdate: moment().subtract(100, 'days'),
              displayDate: moment().subtract(100, 'days'),
              displayDate2: moment().subtract(100, 'days'),
              dcpActualenddate: moment().subtract(100, 'days'),
              dcpMilestoneoutcome: null,
            }),
            server.create('milestone', 'certifiedReferred', {
              statuscode: 'Completed',
              dcpActualenddate: moment().subtract(75, 'days'),
            }),
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'In Progress',
              dcpActualenddate: moment().subtract(75, 'days'),
              dcpPlannedcompletiondate: moment().add(42, 'days'),
              displayDate: moment().add(42, 'days'),
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Not Started',
              dcpPlannedstartdate: moment().add(42, 'days'),
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
        dispositions: dispositionsArray,
        project: server.create('project', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatusSimp: 'In Public Review',
          dispositions: dispositionsArray,
          milestones: [
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'In Progress',
              dcpActualstartdate: moment().subtract(20, 'days'),
              displayDate: moment().subtract(20, 'days'),
              displayDate2: null,
              dcpPlannedcompletiondate: moment().add(10, 'days'),
              dcpMilestoneoutcome: null,
            }),
          ],
        }),
      }),
      // To Review Project 2: BP role for project with both BP and BB roles
      server.create('assignment', {
        tab: 'to-review',
        dcpLupteammemberrole: 'BP',
        dispositions: dispositionsArray2,
        project: server.create('project', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatusSimp: 'In Public Review',
          dispositions: dispositionsArray2,
          milestones: [
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'In Progress',
              dcpActualstartdate: moment().subtract(2, 'days'),
              displayDate: moment().subtract(2, 'days'),
              displayDate2: null,
              dcpPlannedcompletiondate: moment().add(28, 'days'),
              dcpMilestoneoutcome: null,
            }),
          ],
        }),
      }),
      // To Review Project 2: BB role for project with both BP and BB roles
      server.create('assignment', {
        tab: 'to-review',
        dcpLupteammemberrole: 'BB',
        dispositions: dispositionsArray3,
        project: server.create('project', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatusSimp: 'In Public Review',
          dispositions: dispositionsArray3,
          milestones: [
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'In Progress',
              dcpActualstartdate: moment().subtract(2, 'days'),
              displayDate: moment().subtract(2, 'days'),
              displayDate2: null,
              dcpPlannedcompletiondate: moment().add(28, 'days'),
              dcpMilestoneoutcome: null,
            }),
          ],
        }),
      }),

      // REVIEWED
      //----------------------------------------

      // Reviewed Project 1: CB Approved w/ Mod, CB Disapproved, BP Approved, CPC Review
      server.create('assignment', {
        tab: 'reviewed',
        dcpLupteammemberrole: 'CB',
        project: server.create('project', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatusSimp: 'In Public Review',
          dispositions: [
            server.create('disposition', 'withAction', {
              dcpRecommendationsubmittedbyname: 'QNBP',
              dcpBoroughpresidentrecommendation: 'Approved',
              dcpDatereceived: moment().subtract(90, 'days'),
            }),
            server.create('disposition', 'withAction', {
              dcpRecommendationsubmittedbyname: 'QNCB4',
              dcpCommunityboardrecommendation: 'Approved with Modifications/Conditions',
              dcpDatereceived: moment().subtract(120, 'days'),
            }),
            server.create('disposition', 'withAction', {
              dcpRecommendationsubmittedbyname: 'QNCB6',
              dcpCommunityboardrecommendation: 'Disapproved',
              dcpDatereceived: moment().subtract(130, 'days'),
            }),
          ],
          milestones: [
            server.create('milestone', 'communityBoardReview', {
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
            }),
            server.create('milestone', 'boroughPresidentReview', {
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
            }),

            server.create('milestone', 'cityPlanningCommissionReview', {
              statuscode: 'In Progress',
              dcpActualstartdate: moment().subtract(10, 'days'),
              displayDate: moment().subtract(10, 'days'),
              dcpPlannedcompletiondate: moment().add(10, 'days'),
              displayDate2: moment().add(10, 'days'),
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
        project: server.create('project', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatusSimp: 'In Public Review',
          dispositions: [
            server.create('disposition', 'withAction', {
              dcpRecommendationsubmittedbyname: 'QNBP',
              dcpBoroughpresidentrecommendation: 'Approved',
              dcpDatereceived: moment().subtract(82, 'days'),
            }),
            server.create('disposition', 'withAction', {
              dcpRecommendationsubmittedbyname: 'QNCB9',
              dcpCommunityboardrecommendation: 'Approved with Modifications/Conditions',
              dcpDatereceived: moment().subtract(130, 'days'),
            }),
          ],
          milestones: [
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(160, 'days'),
              displayDate: moment().subtract(160, 'days'),
              dcpActualenddate: moment().subtract(130, 'days'),
              displayDate2: moment().subtract(130, 'days'),
              dcpMilestoneoutcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(130, 'days'),
              displayDate: moment().subtract(130, 'days'),
              dcpActualenddate: moment().subtract(82, 'days'),
              displayDate2: moment().subtract(82, 'days'),
              dcpMilestoneoutcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(82, 'days'),
              displayDate: moment().subtract(82, 'days'),
              dcpActualenddate: moment().subtract(47, 'days'),
              displayDate2: moment().subtract(47, 'days'),
              dcpMilestoneoutcome: 'Hearing Closed',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionVote', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(46, 'days'),
              displayDate: moment().subtract(46, 'days'),
              dcpActualenddate: moment().subtract(16, 'days'),
              displayDate2: moment().subtract(16, 'days'),
              dcpMilestoneoutcome: 'Approval',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityCouncilReview', {
              statuscode: 'In Progress',
              dcpActualstartdate: moment().subtract(15, 'days'),
              displayDate: moment().subtract(15, 'days'),
              dcpPlannedcompletiondate: moment().add(15, 'days'),
              displayDate2: moment().add(15, 'days'),
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
        project: server.create('project', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatusSimp: 'In Public Review',
          dispositions: [
            server.create('disposition', 'withAction', {
              dcpRecommendationsubmittedbyname: 'QNBP',
              dcpBoroughpresidentrecommendation: 'Approved',
              dcpDatereceived: moment().subtract(120, 'days'),
            }),
            server.create('disposition', 'withAction', {
              dcpRecommendationsubmittedbyname: 'QNCB12',
              dcpCommunityboardrecommendation: 'Waived',
              dcpDatereceived: moment().subtract(120, 'days'),
            }),
          ],
          milestones: [
            server.create('milestone', 'communityBoardReview', {
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
            }),
            server.create('milestone', 'boroughPresidentReview', {
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
            }),

            server.create('milestone', 'cityPlanningCommissionReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(90, 'days'),
              displayDate: moment().subtract(90, 'days'),
              dcpActualenddate: moment().subtract(71, 'days'),
              displayDate2: moment().subtract(71, 'days'),
              dcpMilestoneoutcome: 'Hearing Closed',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionVote', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(70, 'days'),
              displayDate: moment().subtract(70, 'days'),
              dcpActualenddate: moment().subtract(61, 'days'),
              displayDate2: moment().subtract(61, 'days'),
              dcpMilestoneoutcome: 'Approval',
            }),

            server.create('milestone', 'cityCouncilReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(60, 'days'),
              displayDate: moment().subtract(60, 'days'),
              dcpActualenddate: moment().subtract(30, 'days'),
              displayDate2: moment().subtract(30, 'days'),
              dcpMilestoneoutcome: 'Approval',
            }),

            server.create('milestone', 'mayoralReview', {
              statuscode: 'In Progress',
              dcpActualstartdate: moment().subtract(30, 'days'),
              displayDate: moment().subtract(30, 'days'),
              dcpPlannedcompletiondate: moment().add(8, 'days'),
              displayDate2: moment().add(8, 'days'),
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
        project: server.create('project', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatus: 'Approved',
          dcpPublicstatusSimp: 'Completed',
          dcpProjectcompleted: moment().subtract(40, 'days'),
          dispositions: [
            server.create('disposition', 'withAction', {
              dcpRecommendationsubmittedbyname: 'QNBP',
              dcpBoroughpresidentrecommendation: 'Approved',
              dcpDatereceived: moment().subtract(90, 'days'),
            }),
            server.create('disposition', 'withAction', {
              dcpRecommendationsubmittedbyname: 'QNCB4',
              dcpCommunityboardrecommendation: 'Approved with Modifications/Conditions',
              dcpDatereceived: moment().subtract(120, 'days'),
            }),
            server.create('disposition', 'withAction', {
              dcpRecommendationsubmittedbyname: 'QNCB6',
              dcpCommunityboardrecommendation: 'Disapproved',
              dcpDatereceived: moment().subtract(130, 'days'),
            }),
          ],
          milestones: [
            server.create('milestone', 'communityBoardReview', {
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
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(120, 'days'),
              displayDate: moment().subtract(120, 'days'),
              dcpActualenddate: moment().subtract(110, 'days'),
              displayDate2: moment().subtract(110, 'days'),
              dcpMilestoneoutcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(110, 'days'),
              displayDate: moment().subtract(110, 'days'),
              dcpActualenddate: moment().subtract(90, 'days'),
              displayDate2: moment().subtract(90, 'days'),
            }),

            server.create('milestone', 'cityPlanningCommissionVote', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(110, 'days'),
              displayDate: moment().subtract(110, 'days'),
              dcpActualenddate: moment().subtract(90, 'days'),
              displayDate2: moment().subtract(90, 'days'),
            }),

            server.create('milestone', 'cityCouncilReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(90, 'days'),
              displayDate: moment().subtract(90, 'days'),
              dcpActualenddate: moment().subtract(60, 'days'),
              displayDate2: moment().subtract(60, 'days'),
            }),

            server.create('milestone', 'mayoralReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(60, 'days'),
              displayDate: moment().subtract(60, 'days'),
              dcpActualenddate: moment().subtract(50, 'days'),
              displayDate2: moment().subtract(50, 'days'),
            }),

            server.create('milestone', 'finalLetterSent', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(40, 'days'),
              displayDate: moment().subtract(40, 'days'),
              dcpActualenddate: moment().subtract(40, 'days'),
              displayDate2: moment().subtract(40, 'days'),
            }),
          ],
        }),
      }),
      // Archive Project 2: Approved
      server.create('assignment', {
        tab: 'archive',
        dcpLupteammemberrole: 'CB',
        project: server.create('project', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatus: 'Approved',
          dcpPublicstatusSimp: 'Completed',
          dcpProjectcompleted: moment().subtract(140, 'days'),
          dispositions: [
            server.create('disposition', 'withAction', {
              dcpRecommendationsubmittedbyname: 'QNBP',
              dcpBoroughpresidentrecommendation: 'Approved',
              dcpDatereceived: moment().subtract(290, 'days'),
            }),
            server.create('disposition', 'withAction', {
              dcpRecommendationsubmittedbyname: 'QNCB9',
              dcpCommunityboardrecommendation: 'Approved with Modifications/Conditions',
              dcpDatereceived: moment().subtract(320, 'days'),
            }),
          ],
          milestones: [
            server.create('milestone', 'communityBoardReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(380, 'days'),
              displayDate: moment().subtract(380, 'days'),
              dcpActualenddate: moment().subtract(320, 'days'),
              displayDate2: moment().subtract(320, 'days'),
              dcpMilestoneoutcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),
            server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(320, 'days'),
              displayDate: moment().subtract(320, 'days'),
              dcpActualenddate: moment().subtract(290, 'days'),
              displayDate2: moment().subtract(290, 'days'),
              dcpMilestoneoutcome: 'Approved',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(290, 'days'),
              displayDate: moment().subtract(290, 'days'),
              dcpActualenddate: moment().subtract(210, 'days'),
              displayDate2: moment().subtract(210, 'days'),
            }),

            server.create('milestone', 'cityPlanningCommissionVote', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(210, 'days'),
              displayDate: moment().subtract(210, 'days'),
              dcpActualenddate: moment().subtract(190, 'days'),
              displayDate2: moment().subtract(190, 'days'),
            }),

            server.create('milestone', 'cityCouncilReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(190, 'days'),
              displayDate: moment().subtract(190, 'days'),
              dcpActualenddate: moment().subtract(160, 'days'),
              displayDate2: moment().subtract(160, 'days'),
            }),

            server.create('milestone', 'mayoralReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(160, 'days'),
              displayDate: moment().subtract(160, 'days'),
              dcpActualenddate: moment().subtract(150, 'days'),
              displayDate2: moment().subtract(150, 'days'),
            }),

            server.create('milestone', 'finalLetterSent', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(140, 'days'),
              displayDate: moment().subtract(140, 'days'),
              dcpActualenddate: moment().subtract(140, 'days'),
              displayDate2: moment().subtract(140, 'days'),
            }),
          ],
        }),
      }),
      // Archive Project 3: Withdrawn
      server.create('assignment', {
        tab: 'archive',
        dcpLupteammemberrole: 'CB',
        project: server.create('project', {
          dcpProjectbrief: 'This is a private application requesting a zoning map amendment (ZM) from R5 and R5/C2-2 to C4-4A, and a zoning text amendment (ZR) to the zoning resolution to facilitate a new 6-story, 15,924 zsf, commercial development at 580 16th Ave...',
          dcpPublicstatus: 'Withdrawn/Terminated/Disapproved',
          dcpPublicstatusSimp: 'Completed',
          dcpProjectcompleted: moment().subtract(120, 'days'),
          dispositions: [
            server.create('disposition', 'withAction', {
              dcpRecommendationsubmittedbyname: 'QNBP',
              dcpBoroughpresidentrecommendation: 'Approved',
              dcpDatereceived: moment().subtract(120, 'days'),
            }),
            server.create('disposition', 'withAction', {
              dcpRecommendationsubmittedbyname: 'QNCB12',
              dcpCommunityboardrecommendation: 'Waived',
              dcpDatereceived: moment().subtract(120, 'days'),
            }),
          ],
          milestones: [
            server.create('milestone', 'communityBoardReview', {
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
            }),
            server.create('milestone', 'boroughPresidentReview', {
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
            }),

            server.create('milestone', 'cityPlanningCommissionReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(90, 'days'),
              displayDate: moment().subtract(90, 'days'),
              dcpActualenddate: moment().subtract(71, 'days'),
              displayDate2: moment().subtract(71, 'days'),
              dcpMilestoneoutcome: 'Hearing Closed',
              milestoneLinks: [{
                filename: '2020_QB.pdf',
                url: 'https://www1.nyc.gov/site/planning/index.page',
              }],
            }),

            server.create('milestone', 'cityPlanningCommissionVote', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(70, 'days'),
              displayDate: moment().subtract(70, 'days'),
              dcpActualenddate: moment().subtract(61, 'days'),
              dcpMilestoneoutcome: 'Approval',
            }),

            server.create('milestone', 'cityCouncilReview', {
              statuscode: 'Completed',
              dcpActualstartdate: moment().subtract(160, 'days'),
              displayDate: moment().subtract(160, 'days'),
              dcpActualenddate: moment().subtract(130, 'days'),
              displayDate2: moment().subtract(130, 'days'),
              dcpMilestoneoutcome: 'Disapproved',
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
