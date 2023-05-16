'use strict';

module.exports = {
  name: 'ose-noindex',

  /**
   * Add `<meta name="robots" content="noindex, nofollow">` to <head>.
   * We default to enabled in all environments except production.
   */
  contentFor(type, appConfig) {
    const defaultConfig = {
      enabled: appConfig.environment !== 'production',
    };

    const config = Object.assign({}, defaultConfig, appConfig.noindex || {});

    if (config.enabled && type === 'head') {
      return '<meta name="robots" content="noindex, nofollow" />';
    }

    return '';
  },

  isDevelopingAddon() {
    return true;
  },
};
