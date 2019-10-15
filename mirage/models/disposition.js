import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  project: belongsTo(),
  action: belongsTo(),
  user: belongsTo(),
  assignment: belongsTo(),
});
