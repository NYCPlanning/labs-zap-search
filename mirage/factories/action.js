import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({

  // project: association({
  // }),

  actionId() {
    return '566ede3a-dad0-e711-8125-1458d04e2f18';
  },

  actionName(i) {
    return faker.list.cycle('Zoning Special Permit', 'Zoning Text Amendment', 'Disposition of Non-Residential City-Owned Property', 'Change in City Map')(i);
  },

  action(i) {
    return faker.list.cycle('ZS', 'ZR', 'PP', 'MM')(i);
  },

  status(i) {
    return faker.list.random('Active', 'Approved', 'Certified', 'Referred', 'Terminated', 'Withdrawn')(i);
  },

  isActive(i) {
    return faker.list.random('Active', 'inActive')(i);
  },

  ulurpNumber(i) {
    return faker.list.random('C780076TLK', 'N860877TCM', 'I030148MMQ')(i);
  },

  zoningResolution(i) {
    return faker.list.random('', '4399')(i);
  },

  ccResolutionNumber(i) {
    return faker.list.random('', '2575')(i);
  },
});
