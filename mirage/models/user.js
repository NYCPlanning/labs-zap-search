import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  projects: hasMany(),
  userProjectParticipantTypes: hasMany(),
  assignments: hasMany(),
  dispositions: hasMany(),
});
