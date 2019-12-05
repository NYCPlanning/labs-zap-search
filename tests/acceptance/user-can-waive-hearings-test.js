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
      dispositions: [
        server.create('disposition', {
          id: 1,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectaction: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
          // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
        server.create('disposition', {
          id: 2,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectaction: '9bbfbec7-2407-ea11-a9aa-001dd8308025',
          // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        }),
      ],
      project: this.server.create('project', {
        id: 4,
        actions: [
          server.create('action', { id: '32a6b44c-8c0c-ea11-a9a8-001dd830804f', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          server.create('action', { id: '9bbfbec7-2407-ea11-a9aa-001dd8308025', dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        ],
        dispositions: [
          server.create('disposition', {
            id: 1,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectaction: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
            // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 2,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectaction: '9bbfbec7-2407-ea11-a9aa-001dd8308025',
            // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
          }),
        ],
      }),
    });

    await visit('/my-projects/to-review');

    assert.ok('[data-test-button-post-hearing="4"]');

    assert.notOk(find('[data-test-button="onConfirmOptOutHearing"]'));
    assert.notOk(find('[data-test-button="closeOptOutHearingPopup"]'));

    await click('[data-test-button-opt-out-hearing-popup="4"]');

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
      dispositions: [
        server.create('disposition', {
          id: 1,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectaction: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
          // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
        server.create('disposition', {
          id: 2,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectaction: '9bbfbec7-2407-ea11-a9aa-001dd8308025',
          // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        }),
      ],
      project: this.server.create('project', {
        id: 4,
        actions: [
          server.create('action', { id: '32a6b44c-8c0c-ea11-a9a8-001dd830804f', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          server.create('action', { id: '9bbfbec7-2407-ea11-a9aa-001dd8308025', dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        ],
        dispositions: [
          server.create('disposition', {
            id: 1,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectaction: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
            // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 2,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectaction: '9bbfbec7-2407-ea11-a9aa-001dd8308025',
            // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
          }),
        ],
      }),
    });

    await visit('/my-projects/upcoming');

    assert.ok('[data-test-button-post-hearing="4"]');

    assert.notOk(find('[data-test-button="onConfirmOptOutHearing"]'));
    assert.notOk(find('[data-test-button="closeOptOutHearingPopup"]'));

    await click('[data-test-button-opt-out-hearing-popup="4"]');

    assert.ok(find('[data-test-button="onConfirmOptOutHearing"]'));
    assert.ok(find('[data-test-button="closeOptOutHearingPopup"]'));

    await click('[data-test-button="onConfirmOptOutHearing"]');

    assert.notOk(find('[data-test-button="onConfirmOptOutHearing"]'));

    assert.notOk(find('[data-test-button-opt-out-hearing-popup="4"]'));

    assert.ok(find('[data-test-hearings-waived-message="4"]'));

    assert.equal(this.server.db.dispositions.firstObject.dcpIspublichearingrequired, 'No');
  });

  test('if there is a server error when running .save(), user will see error message on to-review tab', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      tab: 'to-review',
      dispositions: [
        server.create('disposition', {
          id: 1,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectaction: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
          // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
        server.create('disposition', {
          id: 2,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectaction: '9bbfbec7-2407-ea11-a9aa-001dd8308025',
          // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        }),
      ],
      project: this.server.create('project', {
        id: 4,
        actions: [
          server.create('action', { id: '32a6b44c-8c0c-ea11-a9a8-001dd830804f', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          server.create('action', { id: '9bbfbec7-2407-ea11-a9aa-001dd8308025', dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        ],
        dispositions: [
          server.create('disposition', {
            id: 1,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectaction: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
            // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 2,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectaction: '9bbfbec7-2407-ea11-a9aa-001dd8308025',
            // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
          }),
        ],
      }),
    });

    this.server.patch('/dispositions/:id', { errors: ['server problem'] }, 500); // force mirage to error

    await visit('/my-projects/to-review');

    assert.ok(find('[data-test-button-opt-out-hearing-popup="4"]'));

    await click('[data-test-button-opt-out-hearing-popup="4"]');

    assert.ok(find('[data-test-button="onConfirmOptOutHearing"]'));

    await click('[data-test-button="onConfirmOptOutHearing"]');

    assert.ok(find('[data-test-error-alert-message]'));

    await click('[data-test-button="backToMyProjectsAfterError"]');

    assert.ok(find('[data-test-button-opt-out-hearing-popup="4"]'));
  });

  test('if there is a server error when running .save(), user will see error message on upcoming tab', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      tab: 'upcoming',
      dispositions: [
        server.create('disposition', {
          id: 1,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectaction: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
          // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
        server.create('disposition', {
          id: 2,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectaction: '9bbfbec7-2407-ea11-a9aa-001dd8308025',
          // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        }),
      ],
      project: this.server.create('project', {
        id: 4,
        actions: [
          server.create('action', { id: '32a6b44c-8c0c-ea11-a9a8-001dd830804f', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          server.create('action', { id: '9bbfbec7-2407-ea11-a9aa-001dd8308025', dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        ],
        dispositions: [
          server.create('disposition', {
            id: 1,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectaction: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
            // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 2,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectaction: '9bbfbec7-2407-ea11-a9aa-001dd8308025',
            // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
          }),
        ],
      }),
    });

    this.server.patch('/dispositions/:id', { errors: ['server problem'] }, 500); // force mirage to error

    await visit('/my-projects/upcoming');

    assert.ok(find('[data-test-button-opt-out-hearing-popup="4"]'));

    await click('[data-test-button-opt-out-hearing-popup="4"]');

    assert.ok(find('[data-test-button="onConfirmOptOutHearing"]'));

    await click('[data-test-button="onConfirmOptOutHearing"]');

    assert.ok(find('[data-test-error-alert-message]'));

    await click('[data-test-button="backToMyProjectsAfterError"]');

    assert.ok(find('[data-test-button-opt-out-hearing-popup="4"]'));
  });
});
