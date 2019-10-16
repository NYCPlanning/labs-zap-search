import { module, test } from 'qunit';
import {
  visit,
  currentURL,
  findAll,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession } from 'ember-simple-auth/test-support';

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

  test('Correct number of projects displayed in each tab based on tab property in projects', async function(assert) {
    this.server.get('/assignments', function(schema, request) {
      const { queryParams: { tab } } = request;

      return schema.assignments.where({
        tab,
      });
    });

    const user = this.server.create('user');
    this.server.createList('assignment', 2, { user, tab: 'upcoming' }, 'withProject');
    this.server.createList('assignment', 3, { user, tab: 'to-review' }, 'withProject');
    this.server.createList('assignment', 1, { user, tab: 'reviewed' }, 'withProject');
    this.server.createList('assignment', 1, { user, tab: 'archive' }, 'withProject');

    // simulate presence of location hash after OAUTH redirect
    window.location.hash = '#access_token=test';

    await visit('/login');

    // ##### upcoming ##########################################################
    await visit('/my-projects/upcoming');

    assert.equal(currentURL(), '/my-projects/upcoming');

    assert.equal(findAll('[data-test-project-card]').length, 2, 'Number of displayed projects is same as number of users upcoming projects');

    // ##### to-review ##########################################################
    await visit('/my-projects/to-review');

    assert.equal(currentURL(), '/my-projects/to-review');

    assert.equal(findAll('[data-test-project-card]').length, 3, 'Number of displayed projects is same as number of users to-review projects');

    // ##### reviewed ##########################################################
    await visit('/my-projects/reviewed');

    assert.equal(currentURL(), '/my-projects/reviewed');

    assert.equal(findAll('[data-test-project-card]').length, 1, 'Number of displayed projects is same as number of users reviewed projects');

    // ##### archive ##########################################################
    await visit('/my-projects/archive');

    assert.equal(currentURL(), '/my-projects/archive');

    assert.equal(findAll('[data-test-project-card]').length, 1, 'Number of displayed projects is same as number of users archive projects');
  });
});
