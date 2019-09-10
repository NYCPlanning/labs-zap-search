import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  users: hasMany(),
  actions: hasMany(),
  userProjectParticipantTypes: hasMany(),
  dispositions: hasMany(),
  milestones: hasMany(),
});
