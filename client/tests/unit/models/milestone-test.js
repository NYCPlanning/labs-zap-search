import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import moment from 'moment';

module('Unit | Model | milestone', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('milestone', {});
    assert.ok(model);
  });

  test('it computes remainingDays', function(assert) {
    const store = this.owner.lookup('service:store');
    const fiveDaysFromNow = moment()
      .add(5, 'days')
      .add(5, 'seconds') // buffer for the amount of time between now and end of test
      .toString();

    const model = store.createRecord('milestone', {
      dcpPlannedcompletiondate: fiveDaysFromNow,
    });

    assert.equal(model.remainingDays, '5');
  });
});
