import Route from '@ember/routing/route';
import { lookupCommunityDistrict } from '../helpers/lookup-community-district';

export default class SubscribeRoute extends Route {
  model() {
    const subscriptions = { CW: false };
    const districts = lookupCommunityDistrict();
    // eslint-disable-next-line no-restricted-syntax
    for (const district of districts) {
      subscriptions[district.code] = false;
    }

    return { subscriptions, email: '' };
  }
}
