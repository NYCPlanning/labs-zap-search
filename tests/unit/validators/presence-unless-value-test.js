import { module, test } from 'qunit';
import validatePresenceUnlessValue from 'labs-zap-search/validators/presence-unless-value';

module('Unit | Validator | presence-unless-value');

test('it exists', function(assert) {
  assert.ok(validatePresenceUnlessValue());
});
