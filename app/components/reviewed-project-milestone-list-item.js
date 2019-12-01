import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ReviewedProjectMilestoneListItemComponent extends Component {
  @service
  milestoneConstants;

  project = {};

  milestone = {};

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
