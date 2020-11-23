import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  users: hasMany(),
  actions: hasMany(),
  dispositions: hasMany(),
  milestones: hasMany(),
  assignments: hasMany(),
  packages: hasMany(),
});
