import { Factory, trait } from 'ember-cli-mirage';

export default Factory.extend({
  tab: 'to-review',
  dcpLupteammemberrole: 'BB',
  withProject: trait({
    afterCreate(assignment, server) {
      assignment.update({
        project: server.create('project', 'withMilestones'),
      });
    },
  }),
});
