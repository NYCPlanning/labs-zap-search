import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  emailaddress1(i) {
    return faker.list.cycle('bxbp@planning.nyc.gov', 'bxbp@planning.nyc.gov', 'qncb5@planning.nyc.gov')(i);
  },

  name() {
    return faker.name.findName();
  },

  title() {
    return faker.name.jobTitle();
  },

  landUseParticipant(i) {
    return faker.list.cycle('BXBP', 'BXBB', 'QNCB5')(i);
  },
});
