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

  test('button for hearing submission does not show if there are no dispositions', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      tab: 'upcoming',
      user: this.server.create('user'),
      dispositions: [],
      project: this.server.create('project', {
        id: 4,
      }),
    });

    await authenticateSession();

    await visit('/my-projects/upcoming');

    assert.notOk(find('[data-test-button="submitHearing"]'));
  });
});
