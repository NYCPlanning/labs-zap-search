import { Factory, trait } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  emailaddress1(i) {
    let values = ['bxbp@planning.nyc.gov', 'bxbp@planning.nyc.gov', 'qncb5@planning.nyc.gov'];

    return values[i % values.length];
  },

  name() {
    return faker.name.findName();
  },

  title() {
    return faker.name.jobTitle();
  },

  landUseParticipant(i) {
    let values = ['BXBP', 'BXBB', 'QNCB5'];

    return values[i % values.length];
  },

  withAssignments: trait({
    afterCreate(user, server) {
      // withProject generates projects which are updated
      // to associate with a user
      server.createList('assignment', 2, { user }, 'withProject');
    },
  }),
});
