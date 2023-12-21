import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  participantType(i) {
    // TODO: make sure this random data matches up with User's paricipant value.
    // E.g. a BXCB participant cannot have BB participantType;
    return faker.list.random('CB', 'BB', 'BP')(i);
  },
});
