import Component from '@ember/component';
import { action } from '@ember/object';
import { run } from '@ember/runloop';

export default class SubscriptionFormComponent extends Component {
    
    @action
    handleCityWideChecked() {
        this.set('')
    }

    @action
    checkWholeBorough(newValue) {
        const checkboxId = newValue.target.id;
        if (checkboxId === "all-brooklyn") {
            this.set("allBrooklyn", newValue.target.checked) 
        } else if (checkboxId === "all-bronx") {
            this.set("allBronx", newValue.target.checked) 
        } else if (checkboxId === "all-manhattan") {
            this.set("allManhattan", newValue.target.checked) 
        } else if (checkboxId === "all-queens") {
            this.set("allQueens", newValue.target.checked) 
        } else if (checkboxId === "all-staten-island") {
            this.set("allStatenIsland", newValue.target.checked) 
        }
    }
}