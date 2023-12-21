import { module, test } from 'qunit';
import {
  find,
  visit,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import { setupMirage } from 'ember-cli-mirage/test-support';
import { invalidateSession, authenticateSession } from 'ember-simple-auth/test-support';

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
    const user = this.server.create('user', 'withAssignments');

    await authenticateSession({
      id: user.id,
    });

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
    const user = this.server.create('user', 'withAssignments');

    await authenticateSession({
      id: user.id,
    });

    await visit('/my-projects/to-review');

    await visit('/my-projects/1/recommendations/add');

    assert.notOk(find('[data-test-dashboard-tab-links]'));

    await visit('/my-projects/1/hearing/add');

    assert.notOk(find('[data-test-dashboard-tab-links]'));
  });
});
