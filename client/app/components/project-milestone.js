import Component from '@ember/component';
import { computed } from '@ember/object';

export default class ProjectMilestoneComponent extends Component {
  tagName = 'li';

  classNameBindings = ['getClassNames'];

  // @argument
  milestone;

  @computed('milestone.statuscode')
  get getClassNames() {
    const style = '';

    return `grid-x grid-padding-small milestone ${style}`;
  }
}
