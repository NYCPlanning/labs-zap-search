import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  projects: hasMany(),
  userProjectParticipantTypes: hasMany(),
  dispositions: hasMany(),
});
