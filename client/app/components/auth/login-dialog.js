import Component from '@ember/component';
import { computed } from '@ember/object';
import ENV from 'labs-zap-search/config/environment';

/* eslint-disable no-unused-vars */
const MAINTENANCE_RANGE = ENV.maintenanceTimes;

export default Component.extend({
  oauthEndpoint: ENV.OAUTH_ENDPOINT,
  isMaintenancePeriod: computed(function() {
    const [start, end] = MAINTENANCE_RANGE.map(string => new Date(string));
    const now = new Date();

    return now > start && now < end;
  }),

  hasUpcomingMaintenance: computed(function() {
    const [start, end] = MAINTENANCE_RANGE.map(string => new Date(string));
    const now = new Date();

    return now < start;
  }),
});
