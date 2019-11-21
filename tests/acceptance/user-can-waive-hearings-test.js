import { module, test } from 'qunit';
import {
  visit,
  click,
  currentURL,
  find,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession, authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | user can waive hearings', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    window.location.hash = '';

    await invalidateSession();
  });

  hooks.afterEach(async function() {
    window.location.hash = '';

    await invalidateSession();
  });

  hooks.beforeEach(async function() {
    await authenticateSession();
  });

  test('user can waive hearings on to-review page', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      tab: 'to-review',
      user: this.server.create('user'),
      dispositions: [
        this.server.create('disposition', {
          dcpIspublichearingrequired: '',
          dcpDateofpublichearing: null,
          dcpPublichearinglocation: '',
          action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
        this.server.create('disposition', {
          dcpIspublichearingrequired: '',
          dcpDateofpublichearing: null,
          dcpPublichearinglocation: '',
          action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'C780076TLK' }),
        }),
      ],
      project: this.server.create('project', {
        id: 4,
      }),
    });

    await visit('/my-projects/to-review');

    assert.ok('[data-test-button-post-hearing="4"]');

    assert.notOk(find('[data-test-button="onConfirmOptOutHearing"]'));
    assert.notOk(find('[data-test-button="closeOptOutHearingPopup"]'));

    await click('[data-test-button="optOutHearingOpenPopup"]');

    assert.ok(find('[data-test-button="onConfirmOptOutHearing"]'));
    assert.ok(find('[data-test-button="closeOptOutHearingPopup"]'));

    await click('[data-test-button="onConfirmOptOutHearing"]');

    assert.notOk(find('[data-test-button="onConfirmOptOutHearing"]'));

    assert.ok(find('[data-test-hearings-waived-message="4"]'));
    assert.ok(find('[data-test-button="submitRecommendation"]'));

    assert.equal(this.server.db.dispositions.firstObject.dcpIspublichearingrequired, 'No');

    await click('[data-test-button="submitRecommendation"]');

    assert.equal(currentURL(), '/my-projects/4/recommendations/add');

    assert.ok(find('[data-test-hearings-waived-message]'));
  });

  test('user can waive hearings on upcoming page', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      tab: 'upcoming',
      user: this.server.create('user'),
      dispositions: [
        this.server.create('disposition', {
          dcpIspublichearingrequired: '',
          dcpDateofpublichearing: null,
          dcpPublichearinglocation: '',
          action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
        this.server.create('disposition', {
          dcpIspublichearingrequired: '',
          dcpDateofpublichearing: null,
          dcpPublichearinglocation: '',
          action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'C780076TLK' }),
        }),
      ],
      project: this.server.create('project', {
        id: 4,
      }),
    });

    await visit('/my-projects/upcoming');

    assert.ok('[data-test-button-post-hearing="4"]');

    assert.notOk(find('[data-test-button="onConfirmOptOutHearing"]'));
    assert.notOk(find('[data-test-button="closeOptOutHearingPopup"]'));

    await click('[data-test-button="optOutHearingOpenPopup"]');

    assert.ok(find('[data-test-button="onConfirmOptOutHearing"]'));
    assert.ok(find('[data-test-button="closeOptOutHearingPopup"]'));

    await click('[data-test-button="onConfirmOptOutHearing"]');

    assert.notOk(find('[data-test-button="onConfirmOptOutHearing"]'));

    assert.notOk(find('[data-test-button="optOutHearingOpenPopup"]'));

    assert.ok(find('[data-test-hearings-waived-message="4"]'));

    assert.equal(this.server.db._collections[2]._records[0].dcpIspublichearingrequired, 'No');
  });

  test('if there is a server error when running .save(), user will see error message on to-review tab', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      tab: 'to-review',
      dispositions: [
        server.create('disposition', {
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpIspublichearingrequired: '',
        }),
        server.create('disposition', {
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpIspublichearingrequired: '',
        }),
      ],
      project: this.server.create('project', {
        id: 4,
      }),
    });

    this.server.patch('/dispositions/:id', { errors: ['server problem'] }, 500); // force mirage to error

    await visit('/my-projects/to-review');

    assert.ok(find('[data-test-button="optOutHearingOpenPopup"]'));

    await click('[data-test-button="optOutHearingOpenPopup"]');

    assert.ok(find('[data-test-button="onConfirmOptOutHearing"]'));

    await click('[data-test-button="onConfirmOptOutHearing"]');

    assert.equal(this.server.db._collections[2]._records[0].dcpIspublichearingrequired, '');

    assert.ok(find('[data-test-error-alert-message]'));

    await click('[data-test-button="backToMyProjectsAfterError"]');

    assert.ok(find('[data-test-button="optOutHearingOpenPopup"]'));
  });

  test('if there is a server error when running .save(), user will see error message on upcoming tab', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      tab: 'upcoming',
      dispositions: [
        server.create('disposition', {
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpIspublichearingrequired: '',
        }),
        server.create('disposition', {
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpIspublichearingrequired: '',
        }),
      ],
      project: this.server.create('project', {
        id: 4,
      }),
    });

    this.server.patch('/dispositions/:id', { errors: ['server problem'] }, 500); // force mirage to error

    await visit('/my-projects/upcoming');

    assert.ok(find('[data-test-button="optOutHearingOpenPopup"]'));

    await click('[data-test-button="optOutHearingOpenPopup"]');

    assert.ok(find('[data-test-button="onConfirmOptOutHearing"]'));

    await click('[data-test-button="onConfirmOptOutHearing"]');

    assert.equal(this.server.db._collections[2]._records[0].dcpIspublichearingrequired, '');

    assert.ok(find('[data-test-error-alert-message]'));

    await click('[data-test-button="backToMyProjectsAfterError"]');

    assert.ok(find('[data-test-button="optOutHearingOpenPopup"]'));
  });
});
