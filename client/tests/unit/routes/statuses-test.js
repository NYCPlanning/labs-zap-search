import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | statuses', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    const route = this.owner.lookup('route:statuses');
    assert.ok(route);
  });
});
