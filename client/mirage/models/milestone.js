import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  project: belongsTo(),
});
