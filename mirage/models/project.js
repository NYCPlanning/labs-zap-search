import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  user: hasMany(),
  action: hasMany(),
  userProjectParticipantType: hasMany(),
  hearing: belongsTo(),
});
