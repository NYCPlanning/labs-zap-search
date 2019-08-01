import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  email() {
    return faker.list.random('bxbp@planning.nyc.gov', 'qncb5@planning.nyc.gov');
  },

  // participantType calculated from email

  name() {
    return faker.name.findName();
  },

  title() {
    return faker.name.jobTitle();
  },
});
