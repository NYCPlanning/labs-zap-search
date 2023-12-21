import Component from '@ember/component';
import { computed } from '@ember/object';
import {
  COMMUNITY_BOARD_REFERRAL as COMMUNITY_BOARD_REFERRAL_MILESTONE,
  BOROUGH_BOARD_REFERRAL as BOROUGH_BOARD_REFERRAL_MILESTONE,
  BOROUGH_PRESIDENT_REFERRAL as BOROUGH_PRESIDENT_REFERRAL_MILESTONE,
} from '../constants/milestone/constants';

export default class ArchiveProjectMilestoneListItemComponent extends Component {
  project = {};

  milestone = {};

  communityBoardReferralMilestone = COMMUNITY_BOARD_REFERRAL_MILESTONE;

  boroughBoardReferralMilestone = BOROUGH_BOARD_REFERRAL_MILESTONE;

  boroughPresidentReferralMilestone = BOROUGH_PRESIDENT_REFERRAL_MILESTONE;

  @computed('project.dispositions')
  get communityBoardDispositions() {
    return this.project.dispositions.filter(disposition => disposition.dcpCommunityboardrecommendation);
  }

  @computed('project.dispositions')
  get boroughBoardDispositions() {
    return this.project.dispositions.filter(disposition => disposition.dcpBoroughboardrecommendation);
  }

  @computed('project.dispositions')
  get boroughPresidentDispositions() {
    return this.project.dispositions.filter(disposition => disposition.dcpBoroughpresidentrecommendation);
  }
}
