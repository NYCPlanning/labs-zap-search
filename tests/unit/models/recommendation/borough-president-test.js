import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | recommendation/borough president', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('recommendation/borough-president', {});
    assert.ok(model);
  });
});
