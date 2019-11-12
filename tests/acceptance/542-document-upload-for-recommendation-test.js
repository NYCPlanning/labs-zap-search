import { module, test } from 'qunit';
import {
  click,
  fillIn,
  find,
  visit,
  currentURL,
} from '@ember/test-helpers';
import { selectChoose } from 'ember-power-select/test-support';
import { upload } from 'ember-file-upload/test-support';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession, authenticateSession } from 'ember-simple-auth/test-support';
import moment from 'moment';

// Sets up assignment will have 3 dispos with hearings
function setUpProjectAndDispos(server, participantType) {
  server.create('user', {
    id: 1,
    // These two fields don't matter to these tests
    email: 'qncb5@planning.nyc.gov',
    landUseParticipant: 'QNCB5',
    assignments: [
      server.create('assignment', {
        id: 1,
        tab: 'to-review',
        dcpLupteammemberrole: participantType,
        dispositions: [
          server.create('disposition', {
            dcpPublichearinglocation: 'Canal street',
            dcpDateofpublichearing: moment().subtract(22, 'days'),
            action: server.create('action'),
          }),
          server.create('disposition', {
            dcpPublichearinglocation: 'Canal street',
            dcpDateofpublichearing: moment().subtract(22, 'days'),
            action: server.create('action'),
          }),
          server.create('disposition', {
            dcpPublichearinglocation: 'Hudson Yards',
            dcpDateofpublichearing: moment().subtract(28, 'days'),
            action: server.create('action'),
          }),
        ],
        project: server.create('project', {
          actions: server.schema.actions.all(),
          dispositions: server.schema.dispositions.all(),
        }),
      }),
    ],
  });
}

module('Acceptance | 542 document upload for recommendation', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  hooks.beforeEach(async function () {
    window.location.hash = '';

    await invalidateSession();
  });

  hooks.afterEach(async function () {
    window.location.hash = '';

    await invalidateSession();
  });

  test('User can upload and submit a document', async function (assert) {
    setUpProjectAndDispos(server, 'CB');

    await authenticateSession();

    // Fill in all form fields except for documents
    await visit('/my-projects/1/recommendations/add');
    await click('[data-test-quorum-yes="0"]');
    await click('[data-test-quorum-no="1"]');
    await click('[data-test-all-actions-yes]');
    await find('[data-test-all-actions-recommendation-select]');
    await selectChoose('[data-test-all-actions-recommendation]', 'Disapproved');
    await fillIn('[data-test-all-actions-dcpVotinginfavorrecommendation]', 1);
    await fillIn('[data-test-all-actions-dcpVotingagainstrecommendation]', 2);
    await fillIn('[data-test-all-actions-dcpVotingabstainingonrecommendation]', 3);
    await fillIn('[data-test-all-actions-dcpTotalmembersappointedtotheboard]', 4);
    await fillIn('[data-test-all-actions-dcpVotelocation]', 'Smith Street');
    await fillIn('[data-test-all-actions-dcpDateofvote]', '10/17/2019');
    await fillIn('[data-test-all-actions-dcpConsideration]', 'My All Actions Comment');

    const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });

    // https://github.com/adopted-ember-addons/ember-file-upload/blob/master/addon-test-support/index.js
    await upload('#recommendationFileUpload > input', file);

    await click('[data-test-continue]');

    assert.equal(find('[data-test-file-name="foo.txt"]').textContent.replace(/\s/g, ''), 'foo.txt(text/plain)');

    await click('[data-test-submit]');

    assert.equal(currentURL(), '/my-projects/1/recommendations/done');
  });

  test('Confirmation modal reports no files if none attached', async function (assert) {
    setUpProjectAndDispos(server, 'CB');

    await authenticateSession();

    // Fill in all form fields except for documents
    await visit('/my-projects/1/recommendations/add');
    await click('[data-test-quorum-yes="0"]');
    await click('[data-test-quorum-no="1"]');
    await click('[data-test-all-actions-yes]');
    await find('[data-test-all-actions-recommendation-select]');
    await selectChoose('[data-test-all-actions-recommendation]', 'Disapproved');
    await fillIn('[data-test-all-actions-dcpVotinginfavorrecommendation]', 1);
    await fillIn('[data-test-all-actions-dcpVotingagainstrecommendation]', 2);
    await fillIn('[data-test-all-actions-dcpVotingabstainingonrecommendation]', 3);
    await fillIn('[data-test-all-actions-dcpTotalmembersappointedtotheboard]', 4);
    await fillIn('[data-test-all-actions-dcpVotelocation]', 'Smith Street');
    await fillIn('[data-test-all-actions-dcpDateofvote]', '10/17/2019');
    await fillIn('[data-test-all-actions-dcpConsideration]', 'My All Actions Comment');

    await click('[data-test-continue]');

    assert.equal(find('[data-test-confirmation-no-files]').textContent.trim(), 'No files attached.');

    await click('[data-test-submit]');

    assert.equal(currentURL(), '/my-projects/1/recommendations/done');
  });
});
