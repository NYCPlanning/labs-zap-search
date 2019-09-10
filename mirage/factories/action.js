import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({

  // project: association({
  // }),

  action() {
    return '566ede3a-dad0-e711-8125-1458d04e2f18';
  },

  name(i) {
    return faker.list.cycle('Zoning Special Permit', 'Zoning Text Amendment', 'Disposition of Non-Residential City-Owned Property', 'Change in City Map')(i);
  },

  actioncode(i) {
    return faker.list.cycle('ZS', 'ZR', 'PP', 'MM', 'BB', 'ZZ', 'AA', 'CC', 'DD')(i);
  },

  statuscode(i) {
    return faker.list.random('Active', 'Approved', 'Certified', 'Referred', 'Terminated', 'Withdrawn')(i);
  },

  statecode(i) {
    return faker.list.random('Active', 'inActive')(i);
  },

  ulurpnumber(i) {
    return faker.list.random('C780076TLK', 'N860877TCM', 'I030148MMQ')(i);
  },

  zoningresolution(i) {
    return faker.list.random('', '4399')(i);
  },

  ccresolutionnumber(i) {
    return faker.list.random('', '2575')(i);
  },
});
