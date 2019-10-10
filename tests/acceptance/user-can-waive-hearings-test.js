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
    const disp1 = server.create('disposition', {
      id: 17,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
      action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
    });

    this.server.create('project', {
      id: 4,
      tab: 'to-review',
      dispositions: [disp1],
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

    assert.equal(currentURL(), '/my-projects/4/recommendations/add?participantType=CB');

    assert.ok(find('[data-test-hearings-waived-message]'));
  });

  test('User can waive hearings on the show-project page', async function(assert) {
    await authenticateSession();

    const disp1 = server.create('disposition', {
      id: 17,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
      action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
    });
    // user has to be signed in and assigned to that project (dcp_name matches)
    const userProject = server.create('project', {
      id: 5,
      dcp_name: 'P2012M046',
      tab: 'to-review',
      dispositions: [disp1],
    });

    this.server.create('project', {
      id: 5,
      dcp_name: 'P2012M046',
      tab: 'to-review',
      dispositions: [disp1],
    });

    this.server.create('user', {
      emailaddress1: 'testuser@planning.nyc.gov',
      projects: [userProject],
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

    assert.equal(currentURL(), '/my-projects/5/recommendations/add');

    assert.ok(find('[data-test-hearings-waived-message]'));
  });

  test('user can waive hearings on upcoming page', async function(assert) {
    const disp1 = server.create('disposition', {
      id: 17,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
      action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
    });

    this.server.create('project', {
      id: 4,
      tab: 'upcoming',
      dispositions: [disp1],
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
    // user has to be signed in and assigned to that project (dcp_name matches)
    const disp1 = server.create('disposition', {
      id: 17,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
      action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
    });
    // user has to be signed in and assigned to that project (dcp_name matches)
    const userProject = server.create('project', {
      id: 5,
      dcp_name: 'P2012M046',
      tab: 'to-review',
      dispositions: [disp1],
    });

    this.server.create('project', {
      id: 5,
      dcp_name: 'P2012M046',
      tab: 'to-review',
      dispositions: [disp1],
    });

    this.server.create('user', {
      emailaddress1: 'testuser@planning.nyc.gov',
      projects: [userProject],
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
    // user has to be signed in and assigned to that project (dcp_name matches)
    const disp1 = server.create('disposition', {
      id: 17,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
      action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
    });
    // user has to be signed in and assigned to that project (dcp_name matches)
    const userProject = server.create('project', {
      id: 5,
      dcp_name: 'P2012M046',
      tab: 'to-review',
      dispositions: [disp1],
    });

    this.server.create('project', {
      id: 5,
      dcp_name: 'P2012M046',
      tab: 'to-review',
      dispositions: [disp1],
    });

    this.server.create('user', {
      emailaddress1: 'testuser@planning.nyc.gov',
      projects: [userProject],
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
