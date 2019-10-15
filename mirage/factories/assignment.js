import { Factory, trait } from 'ember-cli-mirage';

export default Factory.extend({
  withDispositions: trait({
    afterCreate(assignment, server) {
      server.createList('disposition', 3, { assignments: [assignment] });
    }
  }),
  withProject: trait({
    afterCreate(assignment, server) {
      server.createList('project', 3, { assignments: [assignment] });
    }
  }),
});
