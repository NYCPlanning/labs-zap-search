'use strict';
const NYCID_CLIENT_ID = process.env.NYCID_CLIENT_ID || 'lup-portal-local';

module.exports = {
  name: 'ose-noindex',

  /**
   * Add `<meta name="robots" content="noindex, nofollow">` to <head>.
   * We default to enabled in all environments except production.
   */
  contentFor(type) {
    if (NYCID_CLIENT_ID !== 'lup-portal-production' && type === 'head') {
      return '<meta name="robots" content="noindex, nofollow" />';
    }

    return '';
  },

  isDevelopingAddon() {
    return true;
  },
};
