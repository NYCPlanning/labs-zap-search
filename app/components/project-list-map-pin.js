import Component from '@ember/component';
import { service } from '@ember-decorators/service';
import { classNames } from '@ember-decorators/component';
import { tagName } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';

@tagName('a')
@classNames('button gray text-orange')
export default class ProjectListMapPinComponent extends Component {
  constructor() {
    super(...arguments);
  }

  @service resultMapEvents;

  // required
  @argument
  project = null;

  mouseEnter() {
    const { id } = this.get('project');

    this.get('resultMapEvents').trigger('hover', { id, layerId: 'project-centroids-circle-hover' });
  }

  mouseLeave() {
    this.get('resultMapEvents').trigger('unhover', { layerId: 'project-centroids-circle-hover' });
  }
}
