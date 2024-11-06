import Component from '@ember/component';
import EmberObject, { action } from '@ember/object';
import { lookupCommunityDistrict } from '../helpers/lookup-community-district';
import { tracked } from '@glimmer/tracking';

export default class SubscriptionFormComponent extends Component {
    subs = EmberObject.create({
        'brooklyn': []
    });
    constructor(...args) {
        super(...args);

        // this.set('subs', {
        //     'brooklyn': []
        // })
        const lookupCommunityDistrictObj = lookupCommunityDistrict();
        for (let i = 0; i < lookupCommunityDistrictObj.length; i += 1) {
            const district = lookupCommunityDistrictObj[i];
            if (district.boro == 'Brooklyn') {
                this.subs['brooklyn'].push({ ...district, 'checked': 0 });
            }
        }
        console.log(this.subs.brooklyn);
    }

    @action
    updateDistrictSelection(event) {
        console.log(this.subs['brooklyn']);
    }

    allBrooklyn = false;
    @action
    checkWholeBorough(event) {
        this.set('allBrooklyn', !this.get('allBrooklyn'));
        const value = this.get('allBrooklyn') === true ? 1 : 0;
        console.log(value)
        for (let i = 0; i < this.subs['brooklyn'].length; i += 1) {
            this.set(this.subs.brooklyn[i].checked, value)
            console.log(this.subs.brooklyn[i].checked);
        }
        console.log(this.subs['brooklyn']);

    }
}