import DS from 'ember-data';
import { attr, hasMany } from '@ember-decorators/data';

const { Model } = DS;

export default class RecommendationModel extends Model {
// DB table: dcp_communityboarddisposition

  // Many Actions to Many Recommendations
  // Participants can submit ONE recommendation per action or ONE recommendation for all actions in a project
  @hasMany('action') actions;

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

  @attr('string', { defaultValue: '' }) recommendation;

  // sourced from dcp_consideration
  // memo, exta information from participant
  @attr('string', { defaultValue: '' }) consideration;

  // sourced from dcp_votelocation
  @attr('string', { defaultValue: '' }) voteLocation;

  // calculate this upon form submission
  @attr('date') dateReceived;

  // source from dcp_dateofvote
  @attr('date') dateVoted;
}
