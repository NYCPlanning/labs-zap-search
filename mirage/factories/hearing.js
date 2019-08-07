import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  location() {
    return faker.address.streetAddress();
  },

  date() {
    return faker.date.past();
  },
});
