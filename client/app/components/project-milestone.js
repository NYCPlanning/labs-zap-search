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

    if (!date2 && moment(date1).isBefore()) { return 'past'; }

    if (moment(date1).isBefore() && moment(date2).isBefore()) { return 'past'; }

    if (moment(date1).isBefore() && !moment(date2).isBefore()) { return 'present'; }

    if (!date1) { return 'future no-dates'; }

    return 'future';
  }

  @computed('tense', 'milestone.{displayDate,displayDate2}')
  get timeRelativeToNow() {
    const tense = this.get('tense');
    const date1 = this.get('milestone.displayDate');
    const date2 = this.get('milestone.displayDate2');

    if (!date1) {
      return '';
    }

    // date1 is always truthy at this point
    if (tense === 'past' && date2) {
      return moment(date2).fromNow();
    }

    if (tense === 'past' && !date2) {
      return moment(date1).fromNow();
    }

    if (tense === 'future') {
      return moment(date1).fromNow();
    }

    return 'In Progress';
  }
}
