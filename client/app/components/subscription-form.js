import $ from 'jquery';
import Component from '@glimmer/component';
import { action, set } from '@ember/object';
import { getCommunityDistrictsByBorough } from '../helpers/lookup-community-district';

export default class SubscriptionFormComponent extends Component {
    communityDistrictsByBorough = {};

    isCommunityDistrict = false;

    constructor(...args) {
      super(...args);

      this.communityDistrictsByBorough = getCommunityDistrictsByBorough();
    }

    @action
    checkWholeBorough(event) {
      for (const district of this.communityDistrictsByBorough[event.target.value]) {
        set(this.args.subscriptions, district.code, event.target.checked);
      }
    }

    @action
    closeAllAccordions() {
      $('.accordion').foundation('up', $('.accordion .accordion-content'));
    }
}
