import { Factory, faker, trait } from 'ember-cli-mirage';

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

  withAssignments: trait({
    afterCreate(user, server) {
      // withProject generates projects which are updated
      // to associate with a user
      server.createList('assignment', 2, 'withProject');

      server.db.projects.update({
        users: [user],
      });
    },
  }),

  withUserProjectParticipantTypes: trait({
    afterCreate(user, server) {
      server.createList('user-project-participant-type', 10);
    }
  }),
});
