import Component from '@ember/component';
import { action } from '@ember/object';
import { lookupCommunityDistrict } from '../helpers/lookup-community-district';
import { inject as service } from '@ember/service';

export default class SubscriptionFormComponent extends Component {
    constructor(...args) {
        super(...args);
        this.subscriptions = {
            'Brooklyn': [],
            'Bronx': [],
            'Manhattan': [],
            'Queens': [],
            'Staten-Island': [],
        }

        const lookupCommunityDistrictObj = lookupCommunityDistrict();
        console.log(lookupCommunityDistrictObj);
        for (let i = 0; i < lookupCommunityDistrictObj.length; i +=1 ) {
            const district = lookupCommunityDistrictObj[i];
            if (district.boro == 'Brooklyn') {
                this.subscriptions['Brooklyn'].push({...district, 'checked': false});
            } else if (district.boro == 'Bronx') {
                this.subscriptions['Bronx'].push({...district, 'checked': false});
            } else if (district.boro == 'Manhattan') {
                this.subscriptions['Manhattan'].push({...district, 'checked': false});
            } else if (district.boro == 'Queens') {
                this.subscriptions['Queens'].push({...district, 'checked': false});
            } else if (district.boro == 'Staten Island') {
                this.subscriptions['Staten-Island'].push({...district, 'checked': false});
            }
        }

        console.log(this.subscriptions);
    }
     
    @action
    checkWholeBorough(event) {
        const checkboxId = event.target.id;
        if (checkboxId === "all-brooklyn") {
            this.set("allBrooklyn", event.target.checked) 
        } else if (checkboxId === "all-bronx") {
            this.set("allBronx", event.target.checked) 
        } else if (checkboxId === "all-manhattan") {
            this.set("allManhattan", event.target.checked) 
        } else if (checkboxId === "all-queens") {
            this.set("allQueens", event.target.checked) 
        } else if (checkboxId === "all-staten-island") {
            this.set("allStatenIsland", event.target.checked) 
        }
    }

    @action
    hamdleSubmit(event) {
        event.preventDefault();
        console.log('submitting');
        console.log(event);
    }
}