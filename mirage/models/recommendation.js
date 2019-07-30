import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default class RecommendationMirageModel extends Model {
  actions = hasMany();

  user = belongsTo();
}
