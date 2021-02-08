import Component from '@ember/component';
import { computed } from '@ember/object';

export default class ProjectMilestoneComponent extends Component {
  tagName = 'li';

  classNameBindings = ['getClassNames'];

  // @argument
  milestone;

  @computed('milestone.statuscode')
  get getClassNames() {
    let style = '';

    if (this.milestone.statuscode === 'Not Started') style = 'gray';

    if (this.milestone.statuscode === 'In Progress') style = 'green-glow';

    return `grid-x grid-padding-small milestone ${style}`;
  }
}
