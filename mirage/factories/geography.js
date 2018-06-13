import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  afterCreate(geography, server) {
    server.createList('project', 20, { geography });
  },
});
