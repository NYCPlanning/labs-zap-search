import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';

export default class ProjectListComponent extends Component {
  @argument
  project = {};
}
