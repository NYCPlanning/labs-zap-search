import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({

  // project: association({
  // }),

  dcpAction() {
    return '566ede3a-dad0-e711-8125-1458d04e2f18';
  },

  dcpName(i) {
    let values = ['Zoning Special Permit', 'Zoning Text Amendment', 'Business Improvement District', 'Change in City Map', 'Enclosed Sidewalk Cafe', 'Large Scale Special Permit', 'Zoning Certification'];

    return values[i % values.length];
  },

  actioncode(i) {
    let values = ['ZS', 'ZR', 'PP', 'MM', 'BB', 'ZZ', 'AA', 'CC', 'DD'];

    return values[i % values.length];
  },

  statuscode(i) {
    return faker.helpers.arrayElement(['Active', 'Approved', 'Certified', 'Referred', 'Terminated', 'Withdrawn']);
  },

  statecode(i) {
    return faker.helpers.arrayElement(['Active', 'inActive']);
  },

  dcpUlurpnumber(i) {
    let values = ['C780076TLK', 'N860877TCM', 'I030148MMQ', '200088ZMX', '190172ZMK', 'N190257ZRK', '190256ZMK'];

    return values[i % values.length];
  },

  dcpZoningresolution(i) {
    return faker.helpers.arrayElement(['', '4399']);
  },

  dcpCcresolutionnumber(i) {
    return faker.helpers.arrayElement(['', '2575']);
  },
});
