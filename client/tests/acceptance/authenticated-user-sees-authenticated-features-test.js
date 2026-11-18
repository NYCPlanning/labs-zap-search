import { module, test } from 'qunit';
import {
  visit,
  find,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession, authenticateSession } from 'ember-simple-auth/test-support';

const ZAP_SESSION = { access_token: 'zap-token' };

module('Acceptance | authenticated user sees authenticated features', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    await invalidateSession();
  });

  hooks.afterEach(async function() {
    await invalidateSession();
  });

  test('User does not see hearing and recommendation buttons on show-project if logged out', async function(assert) {
    this.server.create('user', 'withAssignments');

    await visit('/projects/1');

    assert.notOk(find('[data-test-hearing-rec-shortcuts]'));
  });

  test('User sees shortcut box on show-project if logged in and project assigned to them', async function(assert) {
    // user has to be signed in and assigned to that project (dcp_name matches)
    this.server.create('user', 'withAssignments');
    await authenticateSession(ZAP_SESSION);

    await visit('/projects/1');

    assert.ok(find('[data-test-hearing-rec-shortcuts]'));
  });

  test('User does not see shortcut box on show-project if project is not assigned to them', async function(assert) {
    // user has to be signed in and assigned to that project (dcp_name matches)
    // Unclear if the way project assignment is tested here is accurate. TODO: check with product owners
    const userProject = this.server.create('project', {
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

    await authenticateSession(ZAP_SESSION);

    await visit('/projects/1');

    assert.notOk(find('[data-test-hearing-rec-shortcuts]'));
  });
});
