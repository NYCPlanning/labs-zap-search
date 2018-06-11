import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  projectName() {
    return `${faker.company.companyName()}`;
  },

  applicantName() {
    return `${faker.name.firstName()} ${faker.name.lastName()}`;
  },

  dcpProjectName() {
    return faker.company.companyName();
  },

  datePrepared() {
    return faker.date.past();
  },
});
