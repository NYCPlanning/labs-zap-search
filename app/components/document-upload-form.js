import Component from '@ember/component';
import { action } from '@ember/object';
import Queue from 'ember-file-upload/queue';

export default class DocumentUploadForm extends Component {
  // name of the queue
  queueName = 'application'

  onFileAdd = () => {};

  @action
  removeFile(queue, file) {
    queue.remove(file);
  }
}
