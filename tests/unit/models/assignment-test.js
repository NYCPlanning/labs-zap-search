import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Model | assignment', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('assignment', {});
    assert.ok(model);
  });

  test('publicReviewPlannedStartDate is calculated correctly', function(assert) {
    const store = this.owner.lookup('service:store');

    const dateA = new Date('2020-10-21T00:00:00'); // October 21, 2020

    const model = run(() => store.createRecord('assignment', {
      project: store.createRecord('project', {
        milestones: [
          store.createRecord('milestone', {
            dcpMilestone: '923beec4-dad0-e711-8116-1458d04e2fb8',
            dcpPlannedstartdate: dateA,
          }),
        ],
      }),
    }));

    assert.equal(model.publicReviewPlannedStartDate, dateA);
  });
});
