import Component from '@ember/component';
import { computed } from '@ember/object';
import ENV from 'labs-zap-search/config/environment';

const MAINTENANCE_RANGE = ['06/28/2021 19:00', '06/29/2021 19:00'];

export default Component.extend({
  oauthEndpoint: ENV.OAUTH_ENDPOINT,
  isMaintenancePeriod: computed(function() {
    const [from, to] = MAINTENANCE_RANGE.map(string => new Date(string));
    const now = new Date();

    return now > from && now < to;
  }),

  hasUpcomingMaintenance: computed(function() {
    const [, to] = MAINTENANCE_RANGE.map(string => new Date(string));
    const now = new Date();

    return now < to;
  }),
});
