import { Factory, trait } from 'ember-cli-mirage';

export default Factory.extend({
  withProject: trait({
    afterCreate(assignment, server) {
      server.create('project', {
        assignments: [assignment],
      }, 'withActionsAndDispositions', 'withMilestones');
    }
  }),

  afterCreate(assignment, server) {
    const dispositions = server.createList('disposition', 10);

    this.update({ dispositions });
  },
});
