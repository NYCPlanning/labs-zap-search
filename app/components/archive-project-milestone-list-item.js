import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ArchiveProjectMilestoneListItemComponent extends Component {
  @service
  milestoneConstants;

  project = {};

  milestone = {};

  @computed('project.dispositions')
  get communityBoardDispositions() {
    return this.project.dispositions.filter(disposition => disposition.dcpCommunityboardrecommendation);
  }

  // Since all CB dispositions should have the same "dcpDatereceived", get the first one that's defined.
  // TODO: Later, if we break out review outcomes by community board (for projects with multiple CBs),
  // we should also get community board dispositions dcpDatereceived per community board.
  @computed('communityBoardDispositions')
  get anyCommunityBoardDispositionDateReceived() {
    return this.communityBoardDispositions.map(disposition => disposition.dcpDatereceived).find(dcpDatereceived => !!dcpDatereceived);
  }

  @computed('project.dispositions')
  get boroughBoardDispositions() {
    return this.project.dispositions.filter(disposition => disposition.dcpBoroughboardrecommendation);
  }

  // The comment for anyCommunityBoardDispositionDateReceived applies here as well.
  @computed('boroughBoardDispositions')
  get anyBoroughBoardDispositionDateReceived() {
    return this.boroughBoardDispositions.map(disposition => disposition.dcpDatereceived).find(dcpDatereceived => !!dcpDatereceived);
  }

  @computed('project.dispositions')
  get boroughPresidentDispositions() {
    return this.project.dispositions.filter(disposition => disposition.dcpBoroughpresidentrecommendation);
  }

  // The comment for anyCommunityBoardDispositionDateReceived applies here as well.
  @computed('boroughPresidentDispositions')
  get anyBoroughPresidentDispositionDateReceived() {
    return this.boroughPresidentDispositions.map(disposition => disposition.dcpDatereceived).find(dcpDatereceived => !!dcpDatereceived);
  }
}
