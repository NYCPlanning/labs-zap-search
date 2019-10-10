import { module, test } from 'qunit';
import {
  click,
  fillIn,
  find,
  visit,
  currentURL,
} from '@ember/test-helpers';
import { selectChoose } from 'ember-power-select/test-support';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession, authenticateSession } from 'ember-simple-auth/test-support';
import moment from 'moment';

const NUM_CB_USER_PROJECTS = 2;

// First project will have 3 dispos with hearings, second project will have 1 dispo without hearing
function setUpCBProjectAndDispos(server) {
  const seedCBUser = server.create('user', {
    id: 1,
    email: 'qncb5@planning.nyc.gov',
    landUseParticipant: 'QNCB5',
  });
  const seedCBUserProjects = server.createList('project', NUM_CB_USER_PROJECTS, {
    dcpLupteammemberrole: 'CB',
  });
  seedCBUser.projects = seedCBUserProjects;

  let projectIdx = 0;
  seedCBUserProjects[projectIdx].actions = server.createList('action', 3);
  for (let j = 0; j < 2; j += 1) {
    server.create('disposition', {
      user: seedCBUser,
      project: seedCBUserProjects[projectIdx],
      action: seedCBUserProjects[projectIdx].actions.models[j],
      dcpPublichearinglocation: 'Canal street',
      dcpDateofpublichearing: moment().subtract(22, 'days'),
    });
  }

  server.create('disposition', {
    user: seedCBUser,
    project: seedCBUserProjects[projectIdx],
    action: seedCBUserProjects[projectIdx].actions.models[2],
    dcpPublichearinglocation: 'Hudson Yards',
    dcpDateofpublichearing: moment().subtract(28, 'days'),
  });

  projectIdx = 1;
  seedCBUserProjects[projectIdx].actions = server.createList('action', 1);
  server.create('disposition', {
    user: seedCBUser,
    project: seedCBUserProjects[projectIdx],
    action: seedCBUserProjects[projectIdx].actions.models[0],
    dcpPublichearinglocation: null,
    dcpDateofpublichearing: null,
  });
}

module('Acceptance | user can submit recommendation form', function(hooks) {
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

  test('CB User does not see quorum question if no hearings submitted', async function(assert) {
    setUpCBProjectAndDispos(server);

    await authenticateSession();

    await visit('/my-projects/1/recommendations/add');

    assert.ok(find('[data-test-quorum-question]'));
    assert.ok(find('[data-test-hearing-actions-list]'));
  });

  test('CB User does not see quorum question if no hearings submitted', async function(assert) {
    setUpCBProjectAndDispos(server);

    await authenticateSession();

    await visit('/my-projects/2/recommendations/add');

    assert.notOk(find('[data-test-quorum-question]'));
    assert.notOk(find('[data-test-hearing-actions-list]'));
  });

  test('CB User does not see "All Actions" question if project has only one disposition', async function(assert) {
    setUpCBProjectAndDispos(server);

    await authenticateSession();

    await visit('/my-projects/2/recommendations/add');

    await assert.notOk(find('[data-test-all-actions-fieldset]'));
    await assert.notOk(find('[data-test-all-actions-yes]'));
    await assert.notOk(find('[data-test-all-actions-no]'));
  });

  test('CB User can submit one recommendation for all actions', async function(assert) {
    setUpCBProjectAndDispos(server);

    await authenticateSession();

    await visit('/my-projects/1/recommendations/add?participantType=CB');

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

    assert.equal(this.element.querySelector('[data-test-quorum-answer="0').textContent.trim(), 'Yes', 'Confirmation modal shows answer to first quorum quesiton');
    assert.equal(this.element.querySelector('[data-test-quorum-answer="1').textContent.trim(), 'No', 'Confirmation modal shows answer to second quorum quesiton');

    assert.equal(this.element.querySelector('[data-test-confirmation-all-actions-recommendation]').textContent.trim(), 'Disapproved');

    assert.ok(this.element.querySelector('[data-test-confirmation-all-actions-dcpVotinginfavorrecommendation]').textContent.trim().includes('1'), 'Confirmation modal shows votes in favor for all actions');
    assert.ok(this.element.querySelector('[data-test-confirmation-all-actions-dcpVotingagainstrecommendation]').textContent.trim().includes('2'), 'Confirmation modal shows votes against for all actions');
    assert.ok(this.element.querySelector('[data-test-confirmation-all-actions-dcpVotingabstainingonrecommendation]').textContent.trim().includes('3'), 'Confirmation modal shows votes abstain for all actions');
    assert.ok(this.element.querySelector('[data-test-confirmation-all-actions-dcpTotalmembersappointedtotheboard]').textContent.trim().includes('4'), 'Confirmation modal shows total members appointed for all actions');

    assert.ok(this.element.querySelector('[data-test-confirmation-all-actions-dcpVotelocation]').textContent.trim().includes('Smith Street'), 'Confirmation modal shows vote location for all actions.');
    assert.ok(this.element.querySelector('[data-test-confirmation-all-actions-dcpDateofvote]').textContent.includes('Thu Oct 17 2019'), 'Confirmation modal shows date of vote for all actions.');
    assert.ok(this.element.querySelector('[data-test-confirmation-all-actions-dcpConsideration]').textContent.trim().includes('My All Actions Comment'), 'Confirmation modal shows dcpConsideration for all actions.');

    await click('[data-test-submit]');

    assert.equal(currentURL(), '/my-projects/1/recommendations/done');
  });

  test('CB User can submit a recommendation for each action', async function(assert) {
    setUpCBProjectAndDispos(server);

    await authenticateSession();

    await visit('/my-projects/1/recommendations/add?participantType=CB');

    await click('[data-test-quorum-no="0"]');

    await click('[data-test-quorum-yes="1"]');

    await click('[data-test-all-actions-no]');

    await selectChoose('[data-test-each-action-recommendation="0"]', 'Approved');
    await fillIn('[data-test-each-action-votes="in-favor-0"]', 1);
    await fillIn('[data-test-each-action-votes="against-0"]', 2);
    await fillIn('[data-test-each-action-votes="abstain-0"]', 3);
    await fillIn('[data-test-each-action-votes="total-members-0"]', 4);
    await fillIn('[data-test-each-action-dcpConsideration="0', 'My comment for dcpConsideration 0');

    await selectChoose('[data-test-each-action-recommendation="1"]', 'Approved with Modifications/Conditions');
    await fillIn('[data-test-each-action-votes="in-favor-1"]', 4);
    await fillIn('[data-test-each-action-votes="against-1"]', 3);
    await fillIn('[data-test-each-action-votes="abstain-1"]', 2);
    await fillIn('[data-test-each-action-votes="total-members-1"]', 1);
    await fillIn('[data-test-each-action-dcpConsideration="1', 'My comment for dcpConsideration 1');

    await selectChoose('[data-test-each-action-recommendation="2"]', 'Waived');
    await fillIn('[data-test-each-action-votes="in-favor-2"]', 7);
    await fillIn('[data-test-each-action-votes="against-2"]', 7);
    await fillIn('[data-test-each-action-votes="abstain-2"]', 7);
    await fillIn('[data-test-each-action-votes="total-members-2"]', 7);
    await fillIn('[data-test-each-action-dcpConsideration="2', 'My comment for dcpConsideration 2');

    await fillIn('[data-test-all-actions-dcpVotelocation]', 'Bergen Street');
    await fillIn('[data-test-all-actions-dcpDateofvote]', '12/11/2019');

    await click('[data-test-continue]');

    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-recommendation="0"]').textContent.trim().includes('Approved'), 'Confirmation modal shows recommendation for action 0');
    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-votes="in-favor-0"]').textContent.trim().includes('1'), 'Confirmation modal shows votes in favor for action 0');
    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-votes="against-0"]').textContent.trim().includes('2'), 'Confirmation modal shows votes against for action 0');
    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-votes="abstain-0"]').textContent.trim().includes('3'), 'Confirmation modal shows votes abstain for action 0');
    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-votes="total-members-0"]').textContent.trim().includes('4'), 'Confirmation modal shows total members appointed for action 0');
    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-dcpConsideration="0').textContent.trim().includes('My comment for dcpConsideration 0'), 'Confirmation modal shows dcpConsideration for  action 0');

    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-recommendation="1"]').textContent.trim().includes('Approved with Modifications/Conditions'), 'Confirmation modal shows recommendation for action 1');
    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-votes="in-favor-1"]').textContent.trim().includes('4'), 'Confirmation modal shows votes in favor for action 1');
    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-votes="against-1"]').textContent.trim().includes('3'), 'Confirmation modal shows votes against for action 1');
    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-votes="abstain-1"]').textContent.trim().includes('2'), 'Confirmation modal shows votes abstain for action 1');
    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-votes="total-members-1"]').textContent.trim().includes('1'), 'Confirmation modal shows total members appointed for action 1');
    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-dcpConsideration="1"]').textContent.trim().includes('My comment for dcpConsideration 1'), 'Confirmation modal shows dcpConsideration for action 1');

    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-recommendation="2"]').textContent.trim().includes('Waived'), 'Confirmation modal shows recommendation for action 2');
    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-votes="in-favor-2"]').textContent.trim().includes('7'), 'Confirmation modal shows votes in favor for action 2');
    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-votes="against-2"]').textContent.trim().includes('7'), 'Confirmation modal shows votes against for action 2');
    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-votes="abstain-2"]').textContent.trim().includes('7'), 'Confirmation modal shows votes abstain for action 2');
    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-votes="total-members-2"]').textContent.trim().includes('7'), 'Confirmation modal shows total members appointed for action 2');
    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-dcpConsideration="2"]').textContent.trim().includes('My comment for dcpConsideration 2'), 'Confirmation modal shows dcpConsideration for action 2');

    assert.ok(this.element.querySelector('[data-test-confirmation-all-actions-dcpVotelocation]').textContent.trim().includes('Bergen Street'), 'Confirmation modal shows vote location for all actions.');
    assert.ok(this.element.querySelector('[data-test-confirmation-all-actions-dcpDateofvote]').textContent.includes('Wed Dec 11 2019'), 'Confirmation modal shows date of vote for all actions.');

    await click('[data-test-submit]');

    assert.equal(currentURL(), '/my-projects/1/recommendations/done');
  });

  test('BP User can submit one recommendation for all actions', async function(assert) {
    setUpCBProjectAndDispos(server);

    await authenticateSession();

    await visit('/my-projects/1/recommendations/add?participantType=BP');

    await click('[data-test-quorum-no="0"]');

    await click('[data-test-quorum-no="1"]');

    await click('[data-test-all-actions-yes]');

    await selectChoose('[data-test-all-actions-recommendation]', 'Disapproved');
    await fillIn('[data-test-all-actions-dcpConsideration]', 'My comment for all actions');

    await click('[data-test-continue]');

    assert.equal(this.element.querySelector('[data-test-confirmation-all-actions-recommendation]').textContent.trim(), 'Disapproved');
    assert.ok(this.element.querySelector('[data-test-confirmation-all-actions-dcpConsideration]').textContent.trim().includes('My comment for all actions'), 'Confirmation modal shows dcpConsideration for all actions.');

    await click('[data-test-submit]');

    assert.equal(currentURL(), '/my-projects/1/recommendations/done');
  });

  test('BP User can submit a recommendation for each action', async function(assert) {
    setUpCBProjectAndDispos(server);

    await authenticateSession();

    await visit('/my-projects/1/recommendations/add?participantType=BP');

    await click('[data-test-quorum-no="0"]');

    await click('[data-test-quorum-yes="1"]');

    await click('[data-test-all-actions-no]');

    await selectChoose('[data-test-each-action-recommendation="0"]', 'Approved');
    await fillIn('[data-test-each-action-dcpConsideration="0', 'My comment for dcpConsideration 0');

    await selectChoose('[data-test-each-action-recommendation="1"]', 'Approved with Modifications/Conditions');
    await fillIn('[data-test-each-action-dcpConsideration="1', 'My comment for dcpConsideration 1');

    await selectChoose('[data-test-each-action-recommendation="2"]', 'Waived');
    await fillIn('[data-test-each-action-dcpConsideration="2', 'My comment for dcpConsideration 2');

    await click('[data-test-continue]');

    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-recommendation="0"]').textContent.trim().includes('Approved'), 'Confirmation modal shows recommendation for action 0');
    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-dcpConsideration="0').textContent.trim().includes('My comment for dcpConsideration 0'), 'Confirmation modal shows dcpConsideration for  action 0');

    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-recommendation="1"]').textContent.trim().includes('Approved with Modifications/Conditions'), 'Confirmation modal shows recommendation for action 1');
    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-dcpConsideration="1"]').textContent.trim().includes('My comment for dcpConsideration 1'), 'Confirmation modal shows dcpConsideration for action 1');

    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-recommendation="2"]').textContent.trim().includes('Waived'), 'Confirmation modal shows recommendation for action 2');
    assert.ok(this.element.querySelector('[data-test-confirmation-each-action-dcpConsideration="2"]').textContent.trim().includes('My comment for dcpConsideration 2'), 'Confirmation modal shows dcpConsideration for action 2');

    await click('[data-test-submit]');

    assert.equal(currentURL(), '/my-projects/1/recommendations/done');
  });

  test('BP does not see vote fields', async function(assert) {
    setUpCBProjectAndDispos(server);

    await authenticateSession();

    await visit('/my-projects/1/recommendations/add?participantType=BP');

    await click('[data-test-quorum-no="0"]');

    await click('[data-test-quorum-yes="1"]');

    await click('[data-test-all-actions-yes]');

    assert.ok(find('[data-test-all-actions-recommendation]'));
    assert.notOk(find('[data-test-all-actions-dcpVotinginfavorrecommendation]'));
    assert.notOk(find('[data-test-all-actions-dcpVotingagainstrecommendation]'));
    assert.notOk(find('[data-test-all-actions-dcpVotingabstainingonrecommendation]'));
    assert.notOk(find('[data-test-all-actions-dcpVotelocation]'));
    assert.ok(find('[data-test-all-actions-dcpConsideration]'));

    await click('[data-test-all-actions-no]');

    assert.ok(find('[data-test-each-action-recommendation="0"]'));
    assert.notOk(find('[data-test-each-action-votes="in-favor-0"]'));
    assert.notOk(find('[data-test-each-action-votes="against-0"]'));
    assert.notOk(find('[data-test-each-action-votes="abstain-0"]'));
    assert.notOk(find('[data-test-each-action-votes="total-members-0"]'));
    assert.ok(find('[data-test-each-action-dcpConsideration="0"]'));

    assert.ok(find('[data-test-each-action-recommendation="1"]'));
    assert.notOk(find('[data-test-each-action-votes="in-favor-1"]'));
    assert.notOk(find('[data-test-each-action-votes="against-1"]'));
    assert.notOk(find('[data-test-each-action-votes="abstain-1"]'));
    assert.notOk(find('[data-test-each-action-votes="total-members-1"]'));
    assert.ok(find('[data-test-each-action-dcpConsideration="1"]'));
  });

  test('BP does not see vote fields on confirmation modal', async function(assert) {
    setUpCBProjectAndDispos(server);

    await authenticateSession();

    await visit('/my-projects/1/recommendations/add?participantType=BP');

    await click('[data-test-quorum-yes="0"]');

    await click('[data-test-quorum-yes="1"]');

    await click('[data-test-all-actions-yes]');

    await selectChoose('[data-test-all-actions-recommendation]', 'Disapproved');
    await fillIn('[data-test-all-actions-dcpConsideration]', 'My comment for all actions');

    await click('[data-test-continue]');

    assert.ok(find('[data-test-confirmation-all-actions-recommendation]'));
    assert.notOk(find('[data-test-confirmation-all-actions-dcpVotinginfavorrecommendation]'));
    assert.notOk(find('[data-test-confirmation-all-actions-dcpVotingagainstrecommendation]'));
    assert.notOk(find('[data-test-confirmation-all-actions-dcpVotingabstainingonrecommendation]'));
    assert.notOk(find('[data-test-confirmation-all-actions-dcpVotelocation]'));
    assert.ok(find('[data-test-confirmation-all-actions-dcpConsideration]'));

    await click('[data-test-cancel]');

    await click('[data-test-all-actions-no]');

    await selectChoose('[data-test-each-action-recommendation="0"]', 'Approved');
    await fillIn('[data-test-each-action-dcpConsideration="0', 'My comment for dcpConsideration 0');

    await selectChoose('[data-test-each-action-recommendation="1"]', 'Approved with Modifications/Conditions');
    await fillIn('[data-test-each-action-dcpConsideration="1', 'My comment for dcpConsideration 1');

    await selectChoose('[data-test-each-action-recommendation="2"]', 'Waived');
    await fillIn('[data-test-each-action-dcpConsideration="2', 'My comment for dcpConsideration 2');

    await click('[data-test-continue]');

    assert.ok(find('[data-test-confirmation-each-action-recommendation="0"]'));
    assert.notOk(find('[data-test-confirmation-each-action-votes="in-favor-0"]'));
    assert.notOk(find('[data-test-confirmation-each-action-votes="against-0"]'));
    assert.notOk(find('[data-test-confirmation-each-action-votes="abstain-0"]'));
    assert.notOk(find('[data-test-confirmation-each-action-votes="total-members-0"]'));
    assert.ok(find('[data-test-confirmation-each-action-dcpConsideration="0"]'));

    assert.ok(find('[data-test-confirmation-each-action-recommendation="1"]'));
    assert.notOk(find('[data-test-confirmation-each-action-votes="in-favor-1"]'));
    assert.notOk(find('[data-test-confirmation-each-action-votes="against-1"]'));
    assert.notOk(find('[data-test-confirmation-each-action-votes="abstain-1"]'));
    assert.notOk(find('[data-test-confirmation-each-action-votes="total-members-1"]'));
    assert.ok(find('[data-test-confirmation-each-action-dcpConsideration="1"]'));
  });

  test('CB User can waive vote fields', async function(assert) {
    setUpCBProjectAndDispos(server);

    await authenticateSession();

    await visit('/my-projects/1/recommendations/add?participantType=CB');

    await click('[data-test-quorum-yes="0"]');

    await click('[data-test-quorum-no="1"]');

    await click('[data-test-all-actions-yes]');

    await find('[data-test-all-actions-recommendation-select]');

    await selectChoose('[data-test-all-actions-recommendation]', 'Disapproved');

    await fillIn('[data-test-all-actions-dcpVotinginfavorrecommendation]', '');
    await fillIn('[data-test-all-actions-dcpVotingagainstrecommendation]', '');
    await fillIn('[data-test-all-actions-dcpVotingabstainingonrecommendation]', '');
    await fillIn('[data-test-all-actions-dcpTotalmembersappointedtotheboard]', '');

    await fillIn('[data-test-all-actions-dcpVotelocation]', 'Smith Street');
    await fillIn('[data-test-all-actions-dcpDateofvote]', '10/17/2019');
    await fillIn('[data-test-all-actions-dcpConsideration]', 'My All Actions Comment');

    await click('[data-test-continue]');

    assert.notOk(find('[data-test-confirmation-modal]'));

    await selectChoose('[data-test-all-actions-recommendation]', 'Waived');

    await click('[data-test-continue]');

    assert.ok(find('[data-test-confirmation-modal]'));
  });
});
