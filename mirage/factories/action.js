import { Factory, faker, trait } from 'ember-cli-mirage';

export default Factory.extend({

  // project: association({
  // }),

  dcpAction() {
    return '566ede3a-dad0-e711-8125-1458d04e2f18';
  },

  dcpName(i) {
    return faker.list.cycle('Zoning Special Permit', 'Zoning Text Amendment', 'Business Improvement District', 'Change in City Map', 'Enclosed Sidewalk Cafe', 'Large Scale Special Permit', 'Zoning Certification')(i);
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

  dcpUlurpnumber(i) {
    return faker.list.cycle('C780076TLK', 'N860877TCM', 'I030148MMQ', '200088ZMX', '190172ZMK', 'N190257ZRK', '190256ZMK')(i);
  },

  dcpZoningresolution(i) {
    return faker.list.random('', '4399')(i);
  },

  dcpCcresolutionnumber(i) {
    return faker.list.random('', '2575')(i);
  },
});
