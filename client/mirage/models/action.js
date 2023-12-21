import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  project: belongsTo(),
  dispositions: hasMany(),
});
