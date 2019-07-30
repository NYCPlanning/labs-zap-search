import { Factory, faker } from 'ember-cli-mirage';

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

  recommendation() {
    return faker.list.random('Favorable', 'Unfavorable', 'Waiver of Recommendation', 'Non-Complying');
  },

  consideration() {
    return faker.Lorem.sentences();
  },

  voteLocation() {
    return faker.Address.streetAddress();
  },

  dateReceived() {
    return faker.Date.past();
  },

  dateVoted() {
    return faker.Date.past();
  },

  votesInFavor() {
    return 15;
  },

  votesAgainst() {
    return 4;
  },

  votesAbstain() {
    return 1;
  },

  totalBoardMembers() {
    return 20;
  },

  didQuorumExist() {
    return true;
  },
});
