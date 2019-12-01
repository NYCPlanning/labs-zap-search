import Component from '@ember/component';
import { action } from '@ember/object';

export default class DocumentUploadForm extends Component {
  // name of the queue
  queue = {};

  onFileAdd = () => {};

  @action
  removeFile(queue, file) {
    queue.remove(file);
  }
}
