import { module, test } from 'qunit';
import {
  find,
  visit,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession } from 'ember-simple-auth/test-support';

module('Acceptance | dashboard tab links', function(hooks) {
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

  test('authenticated user sees dashboard tab links on /my-projects/<tab>', async function(assert) {
    this.server.create('user', {
      emailaddress1: 'testuser@planning.nyc.gov',
    });

    // simulate presence of location hash after OAUTH redirect
    window.location.hash = '#access_token=test';

    await visit('/my-projects/to-review');

    assert.ok(find('[data-test-dashboard-tab-links]'), 'User sees tab links on to-review tab');

    await visit('/my-projects/upcoming');

    assert.ok(find('[data-test-dashboard-tab-links]'), 'User sees tab links on upcoming tab');

    await visit('/my-projects/reviewed');

    assert.ok(find('[data-test-dashboard-tab-links]'), 'User sees tab links on reviewed tab');

    await visit('/my-projects/archive');

    assert.ok(find('[data-test-dashboard-tab-links]'), 'User sees tab links on archived tab');
  });

  test('authenticated user does not see dashboard tab links on hearing or rec form pages', async function(assert) {
    const userProject = server.create('project', {
      id: 1,
      dcp_name: 'P2012M046',
    });

    this.server.create('user', {
      emailaddress1: 'testuser@planning.nyc.gov',
      projects: [userProject],
    });

    // simulate presence of location hash after OAUTH redirect
    window.location.hash = '#access_token=test';

    await visit('/my-projects/to-review');

    await visit('/my-projects/1/recommendations/add?participantType=CB');

    assert.notOk(find('[data-test-dashboard-tab-links]'));

    await visit('/my-projects/1/hearing/add');

    assert.notOk(find('[data-test-dashboard-tab-links]'));
  });
});
