import { attr } from '@ember-decorators/data';
import RecommendationModel from '../recommendation';

export default class RecommendationCommunityBoardModel extends RecommendationModel {
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
  @attr('boolean') didQuorumExist;
}
