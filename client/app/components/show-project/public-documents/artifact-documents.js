import Component from '@ember/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from 'labs-zap-search/config/environment';


export default class ArtifactDocumentsComponent extends Component {
  host = ENV.host;

  @tracked showArtifactDocuments = false;

  get formattedArtifactName() {
    return this.artifact.dcpName.split(' - ')[1];
  }

  get hasArtifactDocuments() {
    return this.artifact.documents.length > 0;
  }

  @action
  toggleShowArtifactDocuments() {
    this.showArtifactDocuments = !this.showArtifactDocuments;
  }
}
