import { Factory, faker } from 'ember-cli-mirage';

export default class DispositionFactory extends Factory {
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

  boroughpresidentrecommendation() {
    return faker.random.arrayElement(['Favorable', 'Unfavorable', 'Waiver of Recommendation', 'Non-Complying']);
  }

  boroughboardrecommendation() {
    return faker.random.arrayElement(['Favorable', 'Unfavorable', 'Waiver of Recommendation', 'Non-Complying']);
  }

  communityboardrecommendation() {
    return faker.random.arrayElement(['Favorable', 'Unfavorable', 'Waiver of Recommendation', 'Non-Complying']);
  }

  consideration() {
    return faker.Lorem.sentences();
  }

  votelocation() {
    return faker.Address.streetAddress();
  }

  datereceived() {
    return faker.Date.past();
  }

  dateofvote() {
    return faker.Date.past();
  }

  votinginfavorrecommendation() {
    return 15;
  }

  votingagainstrecommendation() {
    return 4;
  }

  votingabstainingonrecommendation() {
    return 1;
  }

  totalmembersappointedtotheboard() {
    return 20;
  }

  wasaquorumpresent() {
    return null;
  }

  statecode(i) {
    return faker.list.random('Active', 'Inactive')(i);
  }

  statuscode(i) {
    return faker.list.random('Draft', 'Saved', 'Submitted', 'Deactivated', 'Not Submitted')(i);
  }

  docketdescription() {
    return faker.Lorem.sentence();
  }
}
