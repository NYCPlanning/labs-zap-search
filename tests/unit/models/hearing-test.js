import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Model | hearing', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('isScheduled depends on date being truthy', function(assert) {
    const store = this.owner.lookup('service:store');

    const modelWithDateAndLocation = store.createRecord('hearing', { date: 'purple', location: '121 Alabama Ave' });
    const modelWithDate = store.createRecord('hearing', { date: 'purple', location: '' });
    const modelWithLocation = store.createRecord('hearing', { date: null, location: '121 Alabama Ave' });
    const modelWithout = store.createRecord('hearing', { date: null, location: '' });

    // isScheduled should only be true if both date and location are truthy
    assert.equal(modelWithDateAndLocation.isScheduled, true);
    assert.equal(modelWithDate.isScheduled, false);
    assert.equal(modelWithLocation.isScheduled, false);
    assert.equal(modelWithout.isScheduled, false);
  });
});
