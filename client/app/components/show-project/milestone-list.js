import Component from '@ember/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MilestoneListComponent extends Component {
  @tracked showMilestoneList = true;

  @action
  toggleShowMilestoneList() {
    this.showMilestoneList = !this.showMilestoneList;
  }
}
