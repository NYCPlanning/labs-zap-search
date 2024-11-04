import Component from '@ember/component';
import EmberObject, { action } from '@ember/object';
import { lookupCommunityDistrict } from '../helpers/lookup-community-district';
import { tracked } from '@glimmer/tracking';

export default class SubscriptionFormComponent extends Component {
    @tracked subscriptions = EmberObject.create({
        'Brooklyn': [],
        'Bronx': [],
        'Manhattan': [],
        'Queens': [],
        'Staten-Island': [],
    });
    constructor(...args) {
        super(...args);
        

        const lookupCommunityDistrictObj = lookupCommunityDistrict();
        console.log(lookupCommunityDistrictObj);
        for (let i = 0; i < lookupCommunityDistrictObj.length; i +=1 ) {
            const district = lookupCommunityDistrictObj[i];
            if (district.boro == 'Brooklyn') {
                this.subscriptions['Brooklyn'].push({...district, checked: 'false'});
            } else if (district.boro == 'Bronx') {
                this.subscriptions['Bronx'].push({...district, 'checked': 0});
            } else if (district.boro == 'Manhattan') {
                this.subscriptions['Manhattan'].push({...district, 'checked': 0});
            } else if (district.boro == 'Queens') {
                this.subscriptions['Queens'].push({...district, 'checked': 0});
            } else if (district.boro == 'Staten Island') {
                this.subscriptions['Staten-Island'].push({...district, 'checked': 0});
            }
        }
 
        console.log(this.subscriptions);
    }
     
    @action
    checkWholeBorough(event) {
        const checkboxId = event.target.id;
        if (checkboxId === "all-brooklyn") {
            console.log("is-all-brooklyn");
            console.log(this.subscriptions['Brooklyn']);

            for (let i = 0; i < this.subscriptions['Brooklyn'].length; i += 1) {
                const toggleCheckbox = this.subscriptions['Brooklyn'][i].checked === 'false' ? 'true' : 'false';
                this.subscriptions['Brooklyn'][i] = { ...this.subscriptions['Brooklyn'][i], checked: toggleCheckbox }
            }
            // this.set(this.subscriptions['Brooklyn'], newList);
            console.log('sdklj');
            console.log(this.subscriptions['Brooklyn']);
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

    // @action
    // handleSubmit(event) {
    //     event.preventDefault();
    //     console.log('submitting');
    //     console.log(event);
    // }
}