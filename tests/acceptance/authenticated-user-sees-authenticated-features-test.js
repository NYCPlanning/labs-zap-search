import { module, test } from 'qunit';
import {
  visit,
  find,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession } from 'ember-simple-auth/test-support';

module('Acceptance | authenticated user sees authenticated features', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    window.location.hash = '';
    await invalidateSession();

    this.server.create('project', {
      id: 1,
    });
  });

  test('User does not see hearing and recommendation buttons on show-project if logged out', async function(assert) {
    await visit('/projects/1');
    assert.notOk(find('[data-test-hearing-rec-shortcuts]'));
  });

  test('User sees hearing and recommendation buttons on show-project if logged in', async function(assert) {
    this.server.create('user', {
      emailaddress1: 'testuser@planning.nyc.gov',
    });

    // simulate presence of location hash after OAUTH redirect
    window.location.hash = '#access_token=test';

    await visit('/login');

    await visit('/projects/1');

    assert.ok(find('[data-test-hearing-rec-shortcuts]'));
  });
});
