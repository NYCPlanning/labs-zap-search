import Component from '@ember/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PublicDocumentsComponent extends Component {
  @tracked showPublicDocuments = false;

  @tracked showDispositionDocuments = false;

  get hasPublicDocuments () {
    const allPublicPackageDocuments = this.packages.reduce(
      (allDocuments, curPackage) => allDocuments.concat(curPackage.documents),
      [],
    );

    const allPublicArtifactDocuments = this.artifacts.reduce(
      (allDocuments, curArtifact) => allDocuments.concat(curArtifact.documents),
      [],
    );

    const allPublicDispositionDocuments = this.dispositions.reduce(
      (allDocuments, curDisposition) => allDocuments.concat(curDisposition.documents),
      [],
    );

    return allPublicPackageDocuments
      .concat(allPublicDispositionDocuments)
      .concat(allPublicArtifactDocuments).length > 0;
  }

  @action
  toggleShowPublicDocuments() {
    this.showPublicDocuments = !this.showPublicDocuments;
  }

  @action
  toggleShowDispositionDocuments() {
    this.showDispositionDocuments = !this.showDispositionDocuments;
  }
}
