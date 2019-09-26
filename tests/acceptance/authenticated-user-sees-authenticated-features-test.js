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
  });

  hooks.afterEach(async function() {
    window.location.hash = '';

    await invalidateSession();
  });

  test('User does not see hearing and recommendation buttons on show-project if logged out', async function(assert) {
    await visit('/projects/1');

    assert.notOk(find('[data-test-hearing-rec-shortcuts]'));
  });

  test('User sees hearing and recommendation buttons on show-project if logged in and project assigned to them', async function(assert) {
    // user has to be signed in and assigned to that project (dcp_name matches)
    const userProject = server.create('project', {
      id: 1,
      dcp_name: 'P2012M046',
    });

    this.server.create('project', {
      id: 1,
      dcp_name: 'P2012M046',
    });

    this.server.create('user', {
      emailaddress1: 'testuser@planning.nyc.gov',
      projects: [userProject],
    });

    // simulate presence of location hash after OAUTH redirect
    window.location.hash = '#access_token=test';

    await visit('/login');

    await visit('/projects/1');

    assert.ok(find('[data-test-hearing-rec-shortcuts]'));
  });

  test('User does not see hearing and recommendation buttons on show-project if project is not assigned to them', async function(assert) {
    // user has to be signed in and assigned to that project (dcp_name matches)
    const userProject = server.create('project', {
      id: 2,
      dcp_name: 'N2018Q077',
    });

    this.server.create('project', {
      id: 1,
      dcp_name: 'P2012M046',
    });

    this.server.create('user', {
      emailaddress1: 'testuser@planning.nyc.gov',
      projects: [userProject],
    });

    // simulate presence of location hash after OAUTH redirect
    window.location.hash = '#access_token=test';

    await visit('/login');

    await visit('/projects/1');

    assert.notOk(find('[data-test-hearing-rec-shortcuts]'));
  });
});
