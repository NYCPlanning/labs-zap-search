import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { classNames, tagName } from '@ember-decorators/component';

@tagName('a')
@classNames('button hollow expanded map-marker-button')
export default class ProjectListMapPinComponent extends Component {
  @service resultMapEvents;

  // required
  // @argument
  project = null;

  mouseEnter() {
    const { id } = this.project;

    this.resultMapEvents.trigger('hover', { id, layerId: 'project-centroids-circle-hover' });
  }

  mouseLeave() {
    this.resultMapEvents.trigger('unhover', { layerId: 'project-centroids-circle-hover' });
  }

  click () {
    const { project } = this;
    this.resultMapEvents.trigger('click', { project, layerId: 'project-centroids-circle' });
  }
}
