import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | result-map-events', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    const service = this.owner.lookup('service:result-map-events');
    assert.ok(service);
  });
});
