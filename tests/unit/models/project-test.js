import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Model | project', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    const store = this.owner.lookup('service:store');
    const model = run(() => store.createRecord('project', {}));
    assert.ok(model);
  });

  test('hearingsSubmitted calculated correctly', function(assert) {
    const store = this.owner.lookup('service:store');

    const hearingDate = new Date('2020-10-21T18:30:00');

    const disp1 = store.createRecord('disposition', {
      id: 1,
      dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
      dcpDateofpublichearing: hearingDate,
    });

    const disp2 = store.createRecord('disposition', {
      id: 2,
      dcpPublichearinglocation: '144 Piranha Ave, Manhattan, NY',
      dcpDateofpublichearing: hearingDate,
    });

    const disp3 = store.createRecord('disposition', {
      id: 3,
      dcpPublichearinglocation: '186 Alligators Ave, Staten Island, NY',
      dcpDateofpublichearing: hearingDate,
    });

    const model = run(() => store.createRecord('project', {
      dispositions: [disp1, disp2, disp3],
    }));

    assert.equal(model.hearingsSubmitted, true);
    assert.equal(model.hearingsWaived, false);
    assert.equal(model.hearingsSubmittedOrWaived, true);
    assert.equal(model.hearingsNotSubmittedNotWaived, false);
  });

  // Replace this with your real tests.
  test('hearingsWaived calculated correctly', function(assert) {
    const store = this.owner.lookup('service:store');

    const disp1 = store.createRecord('disposition', {
      id: 1,
      dcpPublichearinglocation: 'waived',
      dcpDateofpublichearing: null,
    });

    const disp2 = store.createRecord('disposition', {
      id: 2,
      dcpPublichearinglocation: 'waived',
      dcpDateofpublichearing: null,
    });

    const disp3 = store.createRecord('disposition', {
      id: 3,
      dcpPublichearinglocation: 'waived',
      dcpDateofpublichearing: null,
    });

    const model = run(() => store.createRecord('project', {
      dispositions: [disp1, disp2, disp3],
    }));

    assert.equal(model.hearingsSubmitted, false);
    assert.equal(model.hearingsWaived, true);
    assert.equal(model.hearingsSubmittedOrWaived, true);
    assert.equal(model.hearingsNotSubmittedNotWaived, false);
  });

  // Replace this with your real tests.
  test('hearingsNotSubmittedNotWaived calculated correctly', function(assert) {
    const store = this.owner.lookup('service:store');

    const disp1 = store.createRecord('disposition', {
      id: 1,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
    });

    const disp2 = store.createRecord('disposition', {
      id: 2,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
    });

    const disp3 = store.createRecord('disposition', {
      id: 3,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
    });

    const model = run(() => store.createRecord('project', {
      dispositions: [disp1, disp2, disp3],
    }));

    assert.equal(model.hearingsSubmitted, false);
    assert.equal(model.hearingsWaived, false);
    assert.equal(model.hearingsSubmittedOrWaived, false);
    assert.equal(model.hearingsNotSubmittedNotWaived, true);
  });
});
