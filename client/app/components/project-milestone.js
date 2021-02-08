import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default class ProjectMilestoneComponent extends Component {
  tagName = 'li';

  classNameBindings = ['getClassNames'];

  // @argument
  milestone;

  @computed('tense')
  get getClassNames() {
    const { tense } = this;
    return `grid-x grid-padding-small milestone ${tense}`;
  }

  // one of 'past', 'present', or 'future'
  @computed('milestone.{displayDate,displayDate2}')
  get tense() {
    const date1 = this.get('milestone.displayDate');
    const date2 = this.get('milestone.displayDate2');

    if (moment(date1).isBefore() && !date2) { return 'past'; }

    if (moment(date1).isBefore() && moment(date2).isBefore()) { return 'past'; }

    if (moment(date1).isBefore() && !moment(date2).isBefore()) { return 'present'; }

    if (!date1) { return 'future no-dates'; }

    return 'future';
  }
}
