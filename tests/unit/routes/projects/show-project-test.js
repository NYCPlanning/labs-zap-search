import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | projects.show-project', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:projects.show-project');
    assert.ok(route);
  });
});
