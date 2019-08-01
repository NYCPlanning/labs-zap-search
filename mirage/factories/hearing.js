import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  location() {
    return faker.Address.streetAddress();
  },

  date() {
    return faker.Date.past();
  },
});
