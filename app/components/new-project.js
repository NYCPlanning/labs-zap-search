import Component from '@ember/component';
import { service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';

export default class NewProjectComponent extends Component {
  @service store;

  constructor() {
    super(...arguments);

    this.set('projectModel', this.get('store').createRecord('project'));
  }

  projectModel = {}

  @action
  save() {
    this.get('projectModel').save();
  }
}
