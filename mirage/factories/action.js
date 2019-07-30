import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  actionId() {
    return '566ede3a-dad0-e711-8125-1458d04e2f18';
  },

  actionName() {
    return faker.list.random('Zoning Special Permit', 'Zoning Text Amendment', 'Disposition of Non-Residential City-Owned Property', 'Change in City Map');
  },

  actionCode() {
    return faker.list.random('ZS', 'ZR', 'PP', 'MM');
  },

  actionType() {
    return ['Zoning Special Permit', 'Zoning Text Amendment', 'Disposition of Non-Residential City-Owned Property', 'Change in City Map'];
  },

  status() {
    return faker.list.random('Active', 'Approved', 'Certified', 'Referred', 'Terminated', 'Withdrawn');
  },

  isActive() {
    return faker.list.random('Active', 'inActive');
  },

  ulurpNumber() {
    return faker.list.random('C780076TLK', 'N860877TCM', 'I030148MMQ');
  },
});
