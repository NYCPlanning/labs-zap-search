import DS from 'ember-data';
import { attr } from '@ember-decorators/data';

const { Model } = DS;

export default class ProjectModel extends Model {
  @attr() projectArea; // geojson
  @attr('string') projectName;
  @attr('string') applicantName;
  @attr('number') projectId;
  @attr('number', { defaultValue: 0 }) datePrepared;
}
