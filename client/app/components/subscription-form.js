import Component from '@glimmer/component';
import { action, set } from '@ember/object';
import { lookupCommunityDistrict } from '../helpers/lookup-community-district';
import { tracked } from '@glimmer/tracking';

export default class SubscriptionFormComponent extends Component {

    communityDistrictsByBorough = {};
    isCommunityDistrict = false;
    constructor(...args) {
        super(...args);

        const districts = lookupCommunityDistrict();
        for (const district of districts) {
            const {code, num, boro} = district;
            if(boro in this.communityDistrictsByBorough === false) {
                this.communityDistrictsByBorough[boro] = []
            }
            this.communityDistrictsByBorough[boro].push({code, num, boro})
        }
    }

    @action
    checkWholeBorough(event) {
        for(const district of this.communityDistrictsByBorough[event.target.value]) {
            set(this.args.subscriptions, district.code, event.target.checked)
        }
    }

    @action
    closeAllAccordions(event) {
        $('.accordion').foundation('up', $('.accordion .accordion-content'));
    }
}