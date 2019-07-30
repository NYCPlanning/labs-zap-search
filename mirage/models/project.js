import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  users: hasMany(),
  actions: hasMany(),
  userProjectParticipantTypes: hasMany(),
  hearing: belongsTo(),
});
