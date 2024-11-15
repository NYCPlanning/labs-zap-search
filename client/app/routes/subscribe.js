import Route from '@ember/routing/route';
import { lookupCommunityDistrict } from '../helpers/lookup-community-district';

export default class SubscribeRoute extends Route {
  model() {
    const subscriptions = { CW: false };
    const districts = lookupCommunityDistrict();
    for (const district of districts) {
      subscriptions[district.code] = false;
    }

    return { subscriptions, email: '' };
  }
}
