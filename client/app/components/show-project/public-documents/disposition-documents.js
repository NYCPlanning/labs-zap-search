import Component from '@ember/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from 'labs-zap-search/config/environment';


export default class DispositionDocumentsComponent extends Component {
  host = ENV.host;

  @tracked showDispositionDocuments = false;

  get formattedDispositionName() {
    return this.disposition.dcpName;
  }

  get hasDispositionDocuments() {
    return this.disposition.documents.length > 0;
  }

  @action
  toggleShowDispositionDocuments() {
    this.showDispositionDocuments = !this.showDispositionDocuments;
  }
}
