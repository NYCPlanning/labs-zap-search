import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  participantType() {
    return faker.list.random('CB', 'BB', 'BP');
  },
});
