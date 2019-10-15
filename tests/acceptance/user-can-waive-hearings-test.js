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

  test('user can waive hearings on to-review page', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      tab: 'to-review',
      user: this.server.create('user'),
      project: this.server.create('project', {
        id: 4,
        dispositions: this.server.createList('disposition', 1, {
          action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
      }),
      dispositions: this.server.schema.dispositions.all(),
    });

    await authenticateSession();

    await visit('/my-projects/to-review');
    assert.ok('[data-test-button="submitHearing"]');

    assert.notOk(find('[data-test-button="onConfirmOptOutHearing"]'));
    assert.notOk(find('[data-test-button="closeOptOutHearingPopup"]'));

    await click('[data-test-button="optOutHearingOpenPopup"]');

    assert.ok(find('[data-test-button="onConfirmOptOutHearing"]'));
    assert.ok(find('[data-test-button="closeOptOutHearingPopup"]'));

    await click('[data-test-button="onConfirmOptOutHearing"]');

    assert.notOk(find('[data-test-button="onConfirmOptOutHearing"]'));

    assert.ok(find('[data-test-hearings-waived-message]'));
    assert.ok(find('[data-test-button="submitRecommendation"]'));

    await click('[data-test-button="submitRecommendation"]');

    assert.equal(currentURL(), '/my-projects/4/recommendations/add');

    assert.ok(find('[data-test-hearings-waived-message]'));
  });

  test('User can waive hearings on the show-project page', async function(assert) {
    await authenticateSession();

    this.server.create('assignment', {
      id: 4,
      tab: 'to-review',
      user: this.server.create('user', {
        emailaddress1: 'testuser@planning.nyc.gov',
      }),
      project: this.server.create('project', {
        id: 5,
        dcp_name: 'P2012M046',
        dispositions: this.server.createList('disposition', 1, {
          id: 17,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          action: server.create('action', {
            dcpName: 'Zoning Special Permit',
            dcpUlurpnumber: 'C780076TLK',
          }),
        }),
      }),
      dispositions: this.server.schema.dispositions.all(),
    });

    // simulate presence of location hash after OAUTH redirect
    window.location.hash = '#access_token=test';

    await visit('/login');

    await visit('/projects/5');

    assert.ok(find('[data-test-hearing-rec-shortcuts]'));

    assert.ok(find('[data-test-button-hearing-form]'));

    assert.notOk(find('[data-test-button="onConfirmOptOutHearing"]'));
    assert.notOk(find('[data-test-button="closeOptOutHearingPopup"]'));

    await click('[data-test-button="optOutHearingOpenPopup"]');

    assert.ok(find('[data-test-button="onConfirmOptOutHearing"]'));
    assert.ok(find('[data-test-button="closeOptOutHearingPopup"]'));

    await click('[data-test-button="onConfirmOptOutHearing"]');

    assert.notOk(find('[data-test-button-hearing-form]'));
    assert.ok(find('[data-test-hearings-waived-message]'));
    assert.ok(find('[data-test-button-to-rec-form]'));

    await click('[data-test-button-to-rec-form]');

    assert.equal(currentURL(), '/my-projects/4/recommendations/add');

    assert.ok(find('[data-test-hearings-waived-message]'));
  });

  test('user can waive hearings on upcoming page', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      tab: 'upcoming',
      user: this.server.create('user', {
        emailaddress1: 'testuser@planning.nyc.gov',
      }),
      project: this.server.create('project', {
        id: 5,
        dcp_name: 'P2012M046',
        dispositions: this.server.createList('disposition', 1, {
          id: 17,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          action: server.create('action', {
            dcpName: 'Zoning Special Permit',
            dcpUlurpnumber: 'C780076TLK',
          }),
        }),
      }, 'withMilestones'),
      dispositions: this.server.schema.dispositions.all(),
    });

    await authenticateSession();

    await visit('/my-projects/upcoming');

    assert.ok('[data-test-button="submitHearing"]');

    assert.notOk(find('[data-test-button="onConfirmOptOutHearing"]'));
    assert.notOk(find('[data-test-button="closeOptOutHearingPopup"]'));

    await click('[data-test-button="optOutHearingOpenPopup"]');

    assert.ok(find('[data-test-button="onConfirmOptOutHearing"]'));
    assert.ok(find('[data-test-button="closeOptOutHearingPopup"]'));

    await click('[data-test-button="onConfirmOptOutHearing"]');

    assert.notOk(find('[data-test-button="onConfirmOptOutHearing"]'));

    assert.ok(find('[data-test-hearings-waived-message]'));
  });

  test('User waives hearings on show-project page and they appear on to-review', async function(assert) {
    await authenticateSession();

    this.server.create('assignment', {
      id: 4,
      tab: 'to-review',
      user: this.server.create('user', {
        emailaddress1: 'testuser@planning.nyc.gov',
      }),
      project: this.server.create('project', {
        id: 5,
        dcp_name: 'P2012M046',
        dispositions: this.server.createList('disposition', 1, {
          id: 17,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          action: server.create('action', {
            dcpName: 'Zoning Special Permit',
            dcpUlurpnumber: 'C780076TLK',
          }),
        }),
      }, 'withMilestones'),
      dispositions: this.server.schema.dispositions.all(),
    });

    // simulate presence of location hash after OAUTH redirect
    window.location.hash = '#access_token=test';

    await visit('/login');

    await visit('/projects/5');

    await click('[data-test-button="optOutHearingOpenPopup"]');

    await click('[data-test-button="onConfirmOptOutHearing"]');

    await click('[data-test-my-projects-button]');

    assert.ok(find('[data-test-hearings-waived-message="5"]'));
    assert.notOk(find('[data-test-hearings-waived-message="4"]'));
  });

  test('User waives hearings on to-review page and they appear on show-project', async function(assert) {
    await authenticateSession();

    this.server.create('assignment', {
      id: 4,
      tab: 'to-review',
      user: this.server.create('user', {
        emailaddress1: 'testuser@planning.nyc.gov',
      }),
      project: this.server.create('project', {
        id: 5,
        dcp_name: 'P2012M046',
        dispositions: this.server.createList('disposition', 1, {
          id: 17,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          action: server.create('action', {
            dcpName: 'Zoning Special Permit',
            dcpUlurpnumber: 'C780076TLK',
          }),
        }),
      }, 'withMilestones'),
      dispositions: this.server.schema.dispositions.all(),
    });

    // simulate presence of location hash after OAUTH redirect
    window.location.hash = '#access_token=test';

    await visit('/login');

    await visit('/my-projects/to-review');

    assert.ok('[data-test-button="submitHearing"]');

    await click('[data-test-button="optOutHearingOpenPopup"]');

    await click('[data-test-button="onConfirmOptOutHearing"]');

    assert.ok(find('[data-test-hearings-waived-message]'));

    await click('[data-test-project-profile-button="5"]');

    assert.notOk(find('[data-test-button-hearing-form]'));
    assert.ok(find('[data-test-hearings-waived-message]'));
    assert.ok(find('[data-test-button-to-rec-form]'));
  });
});
