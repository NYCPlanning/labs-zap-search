import { Factory, faker, trait } from 'ember-cli-mirage';

export default Factory.extend({
  // #### Recommendation Type per Each of the 3 Participants ####
  // sourced from dcp_dcpBoroughpresidentrecommendation
  // e.g. 'Favorable', 'Conditional Favorable', 'Unfavorable', 'Conditional Unfavorable',
  // 'No Objection', 'Waiver of Recommendation', N/A is defualt

  // sourced from dcp_dcpBoroughboardrecommendation
  // e.g. 'Favorable', 'Conditional Favorable', 'Unfavorable', 'Conditional Unfavorable',
  // 'No Objection', 'Waiver of Recommendation', N/A is defualt

  // sourced from dcp_dcpCommunityboardrecommendation
  // 'Favorable', 'Conditional Favorable', 'Unfavorable', 'Conditional Unfavorable',
  // 'No Objection', 'Waiver of Recommendation',
  // N/A as default

  dcpDatereceived: null,

  dcpWasaquorumpresent: null,

  dcpPublichearinglocation: null,

  dcpDateofpublichearing: null,

  dcpBoroughpresidentrecommendation: null,

  dcpBoroughboardrecommendation: null,

  dcpCommunityboardrecommendation: null,

  // see afterCreate
  dcpRepresenting: 'Borough Board',

  fullname(i) {
    return faker.list.random('QN BB', 'MN BP', 'BK CB14')(i);
  },

  statecode(i) {
    return faker.list.random('Active', 'Inactive')(i);
  },

  statuscode: null,

  submitted: trait({
    dcpConsideration() {
      return faker.lorem.sentences();
    },

    dcpVotelocation() {
      return faker.address.streetAddress();
    },

    dcpDateofvote() {
      return faker.date.past();
    },

    dcpVotinginfavorrecommendation() {
      return 15;
    },

    dcpVotingagainstrecommendation() {
      return 4;
    },

    dcpVotingabstainingonrecommendation() {
      return 1;
    },

    dcpTotalmembersappointedtotheboard() {
      return 20;
    },
    dcpDocketdescription() {
      return faker.lorem.sentence();
    },
  }),

  submittedCommunityBoardDisposition: trait({
    dcpBoroughpresidentrecommendation: null,

    dcpBoroughboardrecommendation: null,

    dcpCommunityboardrecommendation() {
      return faker.random.arrayElement(['Favorable', 'Conditional Favorable', 'Unfavorable', 'Conditional Unfavorable', 'No Objection', 'Waiver of Recommendation']);
    },
  }),

  submittedBoroughBoardDisposition: trait({
    dcpBoroughpresidentrecommendation: null,

    dcpBoroughboardrecommendation() {
      return faker.random.arrayElement(['Favorable', 'Conditional Favorable', 'Unfavorable', 'Conditional Unfavorable', 'No Objection', 'Waiver of Recommendation']);
    },

    dcpCommunityboardrecommendation: null,
  }),

  submittedBoroughPresidentDisposition: trait({
    dcpBoroughpresidentrecommendation() {
      return faker.random.arrayElement(['Favorable', 'Conditional Favorable', 'Unfavorable', 'Conditional Unfavorable', 'No Objection', 'Waiver of Recommendation']);
    },

    dcpBoroughboardrecommendation: null,

    dcpCommunityboardrecommendation: null,
  }),

  withAction: trait({
    afterCreate(disposition, server) {
      disposition.update({ action: server.create('action') });
    },
  }),

  forCommunityBoard: trait({
    fullname: 'QN CB4',
    dcpRepresenting: 'Community Board',
    dcpCommunityboardrecommendation: null,
    dcpIspublichearingrequired: null,
    dcpDateofpublichearing: null,
    dcpDatereceived: null,
    dcpPublichearinglocation: null,
  }),
});
