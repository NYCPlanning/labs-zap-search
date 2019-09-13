import { module, test } from 'qunit';
import {
  visit,
  currentURL,
  findAll,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession } from 'ember-simple-auth/test-support';
import seedMirage from '../../mirage/scenarios/default';


// NOTE: This suite assumes user 1 is logged in.
module('Acceptance | my projects tabs filter', function(hooks) {
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
    // TODO: Remove this dependency on default Mirage scenario if it becomes too much overhead
    // to update these tests to align with them.
    seedMirage(server);
  });

  test('Upcoming tab displays only User upcoming projects', async function(assert) {
    await visit('/my-projects/upcoming');
    assert.equal(currentURL(), '/my-projects/upcoming');

    assert.equal(findAll('[data-test-project-card]').length, 2, 'Number of displayed projects is same as number of users Upcoming projects');

    assert.equal(findAll('[data-test="upcoming-indicator"').length, 2, 'Number of displayed projects indicated as Upcoming is same as number of users Upcoming projects');
  });

  test('To Review tab displays only User To Review projects', async function(assert) {
    await visit('/my-projects/to-review');
    assert.equal(currentURL(), '/my-projects/to-review');

    assert.equal(findAll('[data-test-project-card]').length, 3, 'Number of displayed projects is same as number of users To Review projects');

    assert.equal(findAll('[data-test-submit-recommendation-btn]').length, 3, 'Number of displayed projects w Rec submission buttons is same as number of users To Review projects');
  });

  test('Reviewed tab displays only User reviewed projects', async function(assert) {
    await visit('/my-projects/reviewed');
    assert.equal(currentURL(), '/my-projects/reviewed');

    assert.equal(findAll('[data-test-project-card]').length, 2, 'Number of displayed projects is same as number of users Reviewed projects');

    assert.equal(findAll('[data-test="reviewed-indicator"').length, 2, 'Number of displayed projects indicated as Reviewed is same as number of users Reviewed projects');
  });
});
