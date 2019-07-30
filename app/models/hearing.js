import DS from 'ember-data';
import { attr, belongsTo } from '@ember-decorators/data';

const { Model } = DS;

export default class HearingModel extends Model {
// DB Table: dcp_communityboarddisposition

  // One Action to One Hearing
  @belongsTo('action') action;

  // calculated based on date
  @attr('boolean') isScheduled;

  // sourced from dcp_publichearinglocation
  @attr('string', { defaultValue: '' }) location;

  // sourced from dcp_dateofpublichearing
  @attr('date') date;
}
