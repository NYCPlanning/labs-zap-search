import DS from 'ember-data';
import { attr, belongsTo } from '@ember-decorators/data';

const { Model } = DS;

export default class HearingModel extends Model {
// DB Table: dcp_communityboarddisposition

  // One Hearing to One Project
  @belongsTo('project') project;

  // calculated based on date
  @attr('boolean') isScheduled;

  // sourced from dcp_publichearinglocation
  @attr('string', { defaultValue: '' }) location;

  // sourced from dcp_dateofpublichearing
  @attr('date') date;
}
