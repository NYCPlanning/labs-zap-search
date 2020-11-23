import Component from '@ember/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PublicDocumentsComponent extends Component {
  @tracked showPublicDocuments = false;

  get existsPublicDocuments () {
    const allPublicDocuments = this.packages.reduce(
      (allDocuments, curPackage) => allDocuments.concat(curPackage.documents),
      [],
    );

    return allPublicDocuments.length > 0;
  }

  @action
  toggleShowPublicDocuments() {
    this.showPublicDocuments = !this.showPublicDocuments;
  }
}
