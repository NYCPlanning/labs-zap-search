import DS from 'ember-data';
import { attr, belongsTo } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';

const { Model } = DS;

export default class HearingModel extends Model {
// DB Table: dcp_communityboarddisposition

  // One Hearing to One Project
  @belongsTo('project') project;

  // sourced from dcp_publichearinglocation
  @attr('string', { defaultValue: '' }) location;

  // sourced from dcp_dateofpublichearing
  @attr('date') date;

  @computed('date')
  get isScheduled() {
    const date = this.get('date');
    const isScheduled = !!date;
    return isScheduled;
  }
}
