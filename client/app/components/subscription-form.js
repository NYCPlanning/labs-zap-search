import Component from '@ember/component';
import { action } from '@ember/object';

export default class SubscriptionFormComponent extends Component {
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
}