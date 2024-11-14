import Route from "@ember/routing/route"
import { action } from "@ember/object"
import { lookupCommunityDistrict } from '../helpers/lookup-community-district';


export default class SubscribeRoute extends Route {

  model() {
    let subscriptions = {CW: false}
    const districts = lookupCommunityDistrict();
    for (const district of districts) {
      subscriptions[district.code] = false
    }

    return {subscriptions, email: ""}
  }
}