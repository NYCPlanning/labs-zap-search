import { module, test } from 'qunit';
import { visit, find, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession } from 'ember-simple-auth/test-support';
import { Response } from 'ember-cli-mirage';

module('Acceptance | user can login', function(hooks) {
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

  test('User can login - redirects from oauth', async function(assert) {
    this.server.create('user', {
      emailaddress1: 'testuser@planning.nyc.gov',
    });

    // simulate presence of location hash after OAUTH redirect
    window.location.hash = '#access_token=test';

    await visit('/login');

    assert.equal(find('[data-test-auth-name]').textContent.trim(), 'testuser@planning.nyc.gov');

    assert.equal(currentURL(), '/my-projects/to-review');
  });

  test('User sees error message if the ZAP CRM authentication step fails', async function(assert) {
    this.server.get('/login', function() {
      return new Response(401, {}, { errors: [{ detail: 'We couldn\'t find your email in our system.' }] });
    }, 401);

    // simulate presence of location hash after OAUTH redirect
    window.location.hash = '#access_token=test';

    await visit('/login');

    assert.equal(find('[data-test-error-message="0"]').textContent.trim(), 'We couldn\'t find your email in our system.');
  });
});
