import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Model | hearing', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('isScheduled depends on date being truthy', function(assert) {
    const store = this.owner.lookup('service:store');
    const modelWithDate = store.createRecord('hearing', { date: 'banana' });
    const modelWithoutDate = store.createRecord('hearing', { date: null });
    assert.equal(modelWithDate.isScheduled, true);
    assert.equal(modelWithoutDate.isScheduled, false);
  });
});
