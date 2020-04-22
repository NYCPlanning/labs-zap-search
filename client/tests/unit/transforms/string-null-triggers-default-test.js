import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Transform | null triggers default', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    const transform = this.owner.lookup('transform:string-null-triggers-default');

    assert.equal(transform.deserialize(null), undefined);
  });
});
