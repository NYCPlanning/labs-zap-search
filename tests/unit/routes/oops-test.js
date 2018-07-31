import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | oops', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    const route = this.owner.lookup('route:oops');
    assert.ok(route);
  });
});
