'use strict';

module.exports = {
  extends: 'octane',
  rules: {
    'no-implicit-this': { allow: ['lookup-community-district', 'lookup-action-type'] },
    'link-href-attributes': 'warn',
    'require-valid-alt-text': 'warn',
  },
};
