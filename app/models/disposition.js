import DS from 'ember-data';

const {
  Model, attr, belongsTo,
} = DS;

export default class DispositionModel extends Model {
// DB table: dcp_communityboarddisposition

  // One Project to Many Dispositions
  @belongsTo('project') project;

  // ONE User has Many Dispositions
  @belongsTo('user') user;

  // ONE disposition has ONE action
  @belongsTo('action', { async: true }) action;

  // sourced from dcp_dcpPublichearinglocation
  @attr('string', { defaultValue: '' }) dcpPublichearinglocation;

  // sourced from dcp_dcpDateofpublichearing
  @attr('date', { defaultValue: null }) dcpDateofpublichearing;

  // Not needed
  // @attr('string', { defaultValue: '' }) formCompleterName;

  // Not needed
  // @attr('string', { defaultValue: '' }) formCompleterTitle;

  // #### Recommendation Type per Each of the 3 Participants ####
  // sourced from dcp_boroughpresidentrecommendation
  // e.g. 'Favorable', 'Conditional Favorable', 'Unfavorable', 'Conditional Unfavorable',
  // 'Received after Clock Expired', 'No Objection', 'Waiver of Recommendation', N/A is defualt

  // sourced from dcp_boroughboardrecommendation
  // e.g. 'Favorable', 'Unfavorable', 'Waiver of Recommendation', 'Non-Complying', N/A as default

  // sourced from dcp_communityboardrecommendation
  // 'Approved', 'Approved with Modifications/Conditions', 'Disapproved', 'Disapproved with Modifications/Conditions',
  // 'Non-Complying', 'Vote Quorum Not Present', 'Received after Clock Expired', 'No Objection', 'Waiver of Recommendation',
  // N/A as default

  @attr('string', { defaultValue: '' }) boroughpresidentrecommendation;

  @attr('string', { defaultValue: '' }) boroughboardrecommendation;

  @attr('string', { defaultValue: '' }) communityboardrecommendation;

  // sourced from dcp_consideration
  // memo, exta information from participant
  @attr('string', { defaultValue: '' }) consideration;

  // sourced from dcp_votelocation
  @attr('string', { defaultValue: '' }) votelocation;

  // calculate this upon form submission
  @attr('date') datereceived;

  // link to dcp_dateofvote
  // TODO: investigate the format server expects.
  // potentially switch back to "Date" attribute type, if compatible with
  // backend
  @attr('date', { defaultValue: null }) dateofvote;

  // sourced from statecode
  // "Active" vs "Inactive"
  @attr('string') statecode;

  // sourced from statuscode
  // e.g. 'Draft', 'Saved', 'Submitted', 'Deactivated', 'Not Submitted'
  @attr('string') statuscode;

  // sourced from dcp_docketdescription
  @attr('string') docketdescription;

  // sourced from dcp_votinginfavorrecommendation
  @attr('number') votinginfavorrecommendation;

  // sourced from dcp_votingagainstrecommendation
  @attr('number') votingagainstrecommendation;

  // sourced from dcp_votingabstainingonrecommendation
  @attr('number') votingabstainingonrecommendation;

  // sourced from dcp_totalmembersappointedtotheboard
  @attr('number') totalmembersappointedtotheboard;

  // sourced from dcp_wasaquorumpresent
  @attr('boolean', {
    defaultValue: null,
  }) wasaquorumpresent;

  unknownProperty(key) {
    console.log(`Unexpected access of ${key} on ${this}`);
  }
}
