import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | my-projects', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    const route = this.owner.lookup('route:my-projects');
    assert.ok(route);
  });
});
