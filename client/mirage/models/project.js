import { Model, hasMany } from 'miragejs';

export default Model.extend({
  users: hasMany(),
  actions: hasMany(),
  dispositions: hasMany(),
  milestones: hasMany(),
  assignments: hasMany(),
  packages: hasMany(),
  artifacts: hasMany(),
});
