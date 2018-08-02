import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | show-project', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    const controller = this.owner.lookup('controller:show-project');
    assert.ok(controller);
  });
});
