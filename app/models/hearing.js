import DS from 'ember-data';
import { attr, belongsTo } from '@ember-decorators/data';
import { computed } from '@ember/object';

const { Model } = DS;

export default class HearingModel extends Model {
// DB Table: dcp_communityboarddisposition

  // One Hearing to One Project
  @belongsTo('project') project;

  // sourced from dcp_publichearinglocation
  @attr('string', { defaultValue: '' }) location;

  // sourced from dcp_dateofpublichearing
  @attr('date') date;

  // whether hearing is scheduled
  @computed('date')
  get isScheduled() {
    return !!this.get('date');
  }
}
