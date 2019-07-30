import DS from 'ember-data';
import RecommendationModel from './recommendation';

const { attr } = DS;

export default class CommunityBoardRecommendationModel extends RecommendationModel {
  // extension of RecommendationModel with added attributes

  // sourced from dcp_votinginfavorrecommendation
  @attr('number') votesInFavor;

  // sourced from dcp_votingagainstrecommendation
  @attr('number') votesAgainst;

  // sourced from dcp_votingabstainingonrecommendation
  @attr('number') votesAbstain;

  // sourced from dcp_totalmembersappointedtotheboard
  @attr('number') totalBoardMembers;

  // sourced from dcp_wasaquorumpresent
  @attr('boolean', {
    defaultValue: false,
  }) didQuorumExist;
}
