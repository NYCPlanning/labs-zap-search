import DS from 'ember-data';
import { attr, hasMany } from '@ember-decorators/data';
const { Model } = DS;

export default class GeographyModel extends Model {
  @attr({ defaultValue: 'community-district' }) type;
  @hasMany('project') projects;
}
