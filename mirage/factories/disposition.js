import { Factory, faker, trait } from 'ember-cli-mirage';

export default Factory.extend({
  // #### Recommendation Type per Each of the 3 Participants ####
  // sourced from dcp_boroughpresidentrecommendation
  // e.g. 'Favorable', 'Conditional Favorable', 'Unfavorable', 'Conditional Unfavorable',
  // 'Received after Clock Expired', 'No Objection', 'Waiver of Recommendation', N/A is defualt

  // sourced from dcp_boroughboardrecommendation
  // e.g. 'Favorable', 'Unfavorable', 'Waiver of Recommendation', 'Non-Complying', N/A as default

  // sourced from dcp_communityboardrecommendation
  // 'Approved', 'Approved with Modifications/Conditions', 'Disapproved', 'Disapproved with Modifications/Conditions',
  // 'Non-Complying', 'Vote Quorum Not Present', 'Received after Clock Expired', 'No Objection', 'Waiver of Recommendation',
  // N/A as default

  datereceived: null,

  wasaquorumpresent: null,

  dcpPublichearinglocation: null,

  dcpDateofpublichearing: null,

  boroughpresidentrecommendation: null,

  boroughboardrecommendation: null,

  communityboardrecommendation: null,

  statecode(i) {
    return faker.list.random('Active', 'Inactive')(i);
  },

  statuscode(i) {
    return faker.list.random('Draft', 'Saved', 'Submitted', 'Deactivated', 'Not Submitted')(i);
  },

  submitted: trait({
    consideration() {
      return faker.lorem.sentences();
    },

    votelocation() {
      return faker.address.streetAddress();
    },

    dateofvote() {
      return faker.date.past();
    },

    votinginfavorrecommendation() {
      return 15;
    },

    votingagainstrecommendation() {
      return 4;
    },

    votingabstainingonrecommendation() {
      return 1;
    },

    totalmembersappointedtotheboard() {
      return 20;
    },
    docketdescription() {
      return faker.lorem.sentence();
    },
  }),

  submittedCommunityBoardDisposition: trait({
    boroughpresidentrecommendation: null,

    boroughboardrecommendation: null,

    communityboardrecommendation() {
      return faker.random.arrayElement(['Approved', 'Approved with Modifications/Conditions', 'Disapproved', 'Disapproved with Modifications/Conditions', 'Waived']);
    },
  }),

  submittedBoroughBoardDisposition: trait({
    boroughpresidentrecommendation: null,

    boroughboardrecommendation() {
      return faker.random.arrayElement(['Approved', 'Approved with Modifications/Conditions', 'Disapproved', 'Disapproved with Modifications/Conditions', 'Waived']);
    },

    communityboardrecommendation: null,
  }),

  submittedBoroughPresidentDisposition: trait({
    boroughpresidentrecommendation() {
      return faker.random.arrayElement(['Approved', 'Approved with Modifications/Conditions', 'Disapproved', 'Disapproved with Modifications/Conditions', 'Waived']);
    },

    boroughboardrecommendation: null,

    communityboardrecommendation: null,
  }),
});
