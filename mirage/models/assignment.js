import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  project: belongsTo(),
  user: belongsTo(),
  dispositions: hasMany(),
});
