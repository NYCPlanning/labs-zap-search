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
    return this.project.dispositions.filter(disposition => disposition.communityboardrecommendation);
  }

  // Since all CB dispositions should have the same "datereceived", get the first one that's defined.
  // TODO: Later, if we break out review outcomes by community board (for projects with multiple CBs),
  // we should also get community board dispositions datereceived per community board.
  @computed('communityBoardDispositions')
  get anyCommunityBoardDispositionDateReceived() {
    return this.communityBoardDispositions.map(disposition => disposition.datereceived).find(datereceived => !!datereceived);
  }

  @computed('project.dispositions')
  get boroughBoardDispositions() {
    return this.project.dispositions.filter(disposition => disposition.boroughboardrecommendation);
  }

  // The comment for anyCommunityBoardDispositionDateReceived applies here as well.
  @computed('boroughBoardDispositions')
  get anyBoroughBoardDispositionDateReceived() {
    return this.boroughBoardDispositions.map(disposition => disposition.datereceived).find(datereceived => !!datereceived);
  }

  @computed('project.dispositions')
  get boroughPresidentDispositions() {
    return this.project.dispositions.filter(disposition => disposition.boroughpresidentrecommendation);
  }

  // The comment for anyCommunityBoardDispositionDateReceived applies here as well.
  @computed('boroughPresidentDispositions')
  get anyBoroughPresidentDispositionDateReceived() {
    return this.boroughPresidentDispositions.map(disposition => disposition.datereceived).find(datereceived => !!datereceived);
  }
}
