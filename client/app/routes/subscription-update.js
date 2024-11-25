import Route from '@ember/routing/route';
import fetch from 'fetch';
import ENV from 'labs-zap-search/config/environment';
import { lookupCommunityDistrict } from '../helpers/lookup-community-district';

export default Route.extend({
  async model({ id }) {
    const response = await fetch(`${ENV.host}/subscribers/${id}`);

    const body = await response.json();
    if (!response.ok) throw await response.json();

    const subscriptions = { CW: (body.subscriptions.CW === 1) };
    const districts = lookupCommunityDistrict();
    // eslint-disable-next-line no-restricted-syntax
    for (const district of districts) {
      if (body.subscriptions[district.code] && (body.subscriptions[district.code] === 1)) {
        subscriptions[district.code] = true;
      } else {
        subscriptions[district.code] = false;
      }
    }
    return { id, email: body.email, subscriptions };
  },
});
