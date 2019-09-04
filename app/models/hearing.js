import DS from 'ember-data';

const { attr, belongsTo, Model } = DS;

export default class HearingModel extends Model {
// DB Table: dcp_communityboarddisposition

  // One Hearing to One Project
  @belongsTo('project') project;

  // sourced from dcp_publichearinglocation
  @attr('string', { defaultValue: '' }) location;

  // sourced from dcp_dateofpublichearing
  @attr('date', { defaultValue: null }) date;
}
