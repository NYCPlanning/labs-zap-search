import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | my-projects/project/hearing/done', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    const route = this.owner.lookup('route:my-projects/project/hearing/done');
    assert.ok(route);
  });
});
