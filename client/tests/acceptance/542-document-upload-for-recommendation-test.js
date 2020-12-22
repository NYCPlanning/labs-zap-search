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
import { participantRoles } from 'labs-zap-search/models/assignment';
import { Response } from 'ember-cli-mirage';
import moment from 'moment';

// Sets up assignment will have 3 dispos with hearings
function setUpProjectAndDispos(server, participantType) {
  const { label } = participantRoles.findBy('abbreviation', participantType);

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
            dcpRepresenting: label,
            dcpPublichearinglocation: 'Canal street',
            dcpDateofpublichearing: moment().subtract(22, 'days'),
            dcpProjectaction: 1,
            action: server.create('action', { id: 1 }),
          }),
          server.create('disposition', {
            dcpRepresenting: label,
            dcpPublichearinglocation: 'Canal street',
            dcpDateofpublichearing: moment().subtract(22, 'days'),
            dcpProjectaction: 2,
            action: server.create('action', { id: 2 }),
          }),
          server.create('disposition', {
            dcpRepresenting: label,
            dcpPublichearinglocation: 'Hudson Yards',
            dcpDateofpublichearing: moment().subtract(28, 'days'),
            dcpProjectaction: 3,
            action: server.create('action', { id: 3 }),
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
    await selectChoose('[data-test-all-actions-recommendation]', 'Unfavorable');
    await fillIn('[data-test-all-actions-dcpVotinginfavorrecommendation]', 1);
    await fillIn('[data-test-all-actions-dcpVotingagainstrecommendation]', 2);
    await fillIn('[data-test-all-actions-dcpVotingabstainingonrecommendation]', 3);
    await fillIn('[data-test-all-actions-dcpTotalmembersappointedtotheboard]', 4);
    await fillIn('[data-test-all-actions-dcpVotelocation]', 'Smith Street');
    await fillIn('[data-test-all-actions-dcpDateofvote]', '10/17/2019');
    await fillIn('[data-test-all-actions-dcpConsideration]', 'My All Actions Comment');

    const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });

    // https://github.com/adopted-ember-addons/ember-file-upload/blob/master/addon-test-support/index.js
    await upload('#assign1FileUpload > input', file);

    await click('[data-test-continue]');

    assert.equal(find('[data-test-confirmation-file-name="foo.txt"]').textContent.replace(/\s/g, ''), 'foo.txt(text/plain)');

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
    await selectChoose('[data-test-all-actions-recommendation]', 'Unfavorable');
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

  test('Assert credentials in request body', async function (assert) {
    setUpProjectAndDispos(server, 'CB');

    await authenticateSession({
      access_token: 'some_token',
    });

    // Fill in all form fields except for documents
    await visit('/my-projects/1/recommendations/add');
    await click('[data-test-quorum-yes="0"]');
    await click('[data-test-quorum-no="1"]');
    await click('[data-test-all-actions-yes]');
    await find('[data-test-all-actions-recommendation-select]');
    await selectChoose('[data-test-all-actions-recommendation]', 'Unfavorable');
    await fillIn('[data-test-all-actions-dcpVotinginfavorrecommendation]', 1);
    await fillIn('[data-test-all-actions-dcpVotingagainstrecommendation]', 2);
    await fillIn('[data-test-all-actions-dcpVotingabstainingonrecommendation]', 3);
    await fillIn('[data-test-all-actions-dcpTotalmembersappointedtotheboard]', 4);
    await fillIn('[data-test-all-actions-dcpVotelocation]', 'Smith Street');
    await fillIn('[data-test-all-actions-dcpDateofvote]', '10/17/2019');
    await fillIn('[data-test-all-actions-dcpConsideration]', 'My All Actions Comment');

    const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });

    // https://github.com/adopted-ember-addons/ember-file-upload/blob/master/addon-test-support/index.js
    await upload('#assign1FileUpload > input', file);

    await click('[data-test-continue]');

    await click('[data-test-submit]');

    assert.ok(this.server.pretender.handledRequests.every((req) => {
      console.log(req.requestHeaders.Authorization, req);
      return req.requestHeaders.Authorization === 'Bearer some_token';
    }));
  });

  test('Selected docs are only put into assignment-specific queus', async function (assert) {
    // set up a user with two assignments
    server.create('user', {
      id: 1,
      // These two fields don't matter to these tests
      email: 'qncb5@planning.nyc.gov',
      landUseParticipant: 'QNCB5',
      assignments: [
        server.create('assignment', {
          id: '461be0bc-970b-ea11-x9aa-001d10308025',
          tab: 'to-review',
          dcpLupteammemberrole: 'CB',
          dispositions: [
            server.create('disposition', {
              dcpPublichearinglocation: 'Canal street',
              dcpDateofpublichearing: moment().subtract(22, 'days'),
              action: server.create('action'),
            }),
          ],
          project: server.create('project', {
            actions: server.schema.actions.all(),
            dispositions: server.schema.dispositions.all(),
          }),
        }),
        server.create('assignment', {
          id: '261be0bc-9zzb-ea11-a9aa-001dd8308025',
          tab: 'to-review',
          dcpLupteammemberrole: 'CB',
          dispositions: [
            server.create('disposition', {
              dcpPublichearinglocation: 'Portland street',
              dcpDateofpublichearing: moment().subtract(22, 'days'),
              action: server.create('action'),
            }),
          ],
          project: server.create('project', {
            // Not reflective of real life, but project.actions and
            // project.dispositions here are just fillers
            actions: server.schema.actions.all(),
            dispositions: server.schema.dispositions.all(),
          }),
        }),
      ],
    });

    await authenticateSession();

    await visit('/my-projects/461be0bc-970b-ea11-x9aa-001d10308025/recommendations/add');

    const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });
    const file2 = new File(['foo'], 'foo2.txt', { type: 'text/plain' });

    // https://github.com/adopted-ember-addons/ember-file-upload/blob/master/addon-test-support/index.js
    await upload('#assign461be0bc970bea11x9aa001d10308025FileUpload > input', file);
    await upload('#assign461be0bc970bea11x9aa001d10308025FileUpload > input', file2);

    assert.equal(find('[data-test-file-name="foo.txt"]').textContent.replace(/\s/g, ''), 'foo.txt(text/plain)');
    assert.equal(find('[data-test-file-name="foo2.txt"]').textContent.replace(/\s/g, ''), 'foo2.txt(text/plain)');

    // visit a different assignment
    await visit('/my-projects/261be0bc-9zzb-ea11-a9aa-001dd8308025/recommendations/add');

    assert.notOk(find('[data-test-file-name="foo.txt"]'));
    assert.notOk(find('[data-test-file-name="foo2.txt"]'));
  });

  test('User can upload and submit a rec with document, and retry after error', async function (assert) {
    setUpProjectAndDispos(server, 'CB');

    await authenticateSession();

    // Fill in all form fields except for documents
    await visit('/my-projects/1/recommendations/add');
    await click('[data-test-quorum-yes="0"]');
    await click('[data-test-quorum-no="1"]');
    await click('[data-test-all-actions-yes]');
    await find('[data-test-all-actions-recommendation-select]');
    await selectChoose('[data-test-all-actions-recommendation]', 'Unfavorable');
    await fillIn('[data-test-all-actions-dcpVotinginfavorrecommendation]', 1);
    await fillIn('[data-test-all-actions-dcpVotingagainstrecommendation]', 2);
    await fillIn('[data-test-all-actions-dcpVotingabstainingonrecommendation]', 3);
    await fillIn('[data-test-all-actions-dcpTotalmembersappointedtotheboard]', 4);
    await fillIn('[data-test-all-actions-dcpVotelocation]', 'Smith Street');
    await fillIn('[data-test-all-actions-dcpDateofvote]', '10/17/2019');
    await fillIn('[data-test-all-actions-dcpConsideration]', 'My All Actions Comment');

    const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });

    // https://github.com/adopted-ember-addons/ember-file-upload/blob/master/addon-test-support/index.js
    await upload('#assign1FileUpload > input', file);

    await click('[data-test-continue]');

    assert.equal(find('[data-test-confirmation-file-name="foo.txt"]').textContent.replace(/\s/g, ''), 'foo.txt(text/plain)');

    this.server.patch('/dispositions/:id', { errors: [{ detail: 'server problem' }] }, 500);

    await click('[data-test-submit]');

    const requestCount1 = this.server.pretender.handledRequests.length;

    await this.server.patch('/dispositions/:id');

    await click('[data-test-submit]');

    const requestCount2 = this.server.pretender.handledRequests.length;

    assert.ok(requestCount2 > requestCount1);

    assert.equal(currentURL(), '/my-projects/1/recommendations/done');
  });

  test('User can upload, receive failure from doc upload, and retry', async function (assert) {
    setUpProjectAndDispos(server, 'CB');

    await authenticateSession();

    // Fill in all form fields except for documents
    await visit('/my-projects/1/recommendations/add');
    await click('[data-test-quorum-yes="0"]');
    await click('[data-test-quorum-no="1"]');
    await click('[data-test-all-actions-yes]');
    await find('[data-test-all-actions-recommendation-select]');
    await selectChoose('[data-test-all-actions-recommendation]', 'Unfavorable');
    await fillIn('[data-test-all-actions-dcpVotinginfavorrecommendation]', 1);
    await fillIn('[data-test-all-actions-dcpVotingagainstrecommendation]', 2);
    await fillIn('[data-test-all-actions-dcpVotingabstainingonrecommendation]', 3);
    await fillIn('[data-test-all-actions-dcpTotalmembersappointedtotheboard]', 4);
    await fillIn('[data-test-all-actions-dcpVotelocation]', 'Smith Street');
    await fillIn('[data-test-all-actions-dcpDateofvote]', '10/17/2019');
    await fillIn('[data-test-all-actions-dcpConsideration]', 'My All Actions Comment');

    const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });

    // https://github.com/adopted-ember-addons/ember-file-upload/blob/master/addon-test-support/index.js
    await upload('#assign1FileUpload > input', file);

    await click('[data-test-continue]');

    assert.equal(find('[data-test-confirmation-file-name="foo.txt"]').textContent.replace(/\s/g, ''), 'foo.txt(text/plain)');

    this.server.post('/document', { errors: [{ detail: 'server problem' }] }, 500);

    await click('[data-test-submit]');

    const requestCount1 = this.server.pretender.handledRequests.length;

    // copied from mirage/config
    this.server.post('/document', function(schema, request) {
      // requestBody should be a FormData object
      const { requestBody } = request;
      const success = requestBody.get('instanceId') && requestBody.get('entityName') && requestBody.get('file');
      return success ? new Response(200) : new Response(400, {}, { errors: ['Bad Parameters'] });
    });

    await click('[data-test-submit]');

    const requestCount2 = this.server.pretender.handledRequests.length;

    assert.ok(requestCount2 > requestCount1);

    assert.equal(currentURL(), '/my-projects/1/recommendations/done');
  });
});
