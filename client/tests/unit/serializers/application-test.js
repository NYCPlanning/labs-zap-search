import { module, skip } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Serializer | application', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  skip('it exists', function(assert) {
    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('application');

    assert.ok(serializer);
  });

  skip('it serializes records', function(assert) {
    const store = this.owner.lookup('service:store');
    const record = run(() => store.createRecord('application', {}));

    const serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
