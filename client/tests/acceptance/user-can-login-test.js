import { module, test } from 'qunit';
import {
  visit, find, currentURL, waitFor,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession, currentSession } from 'ember-simple-auth/test-support';
import { Response } from 'ember-cli-mirage';

const EMAIL = 'testuser@planning.nyc.gov';

module('Acceptance | user can login', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    await invalidateSession();
  });

  hooks.afterEach(async function() {
    window.history.replaceState({}, '', '/'); // undo the fake NYC.ID redirect URL
    await invalidateSession();
  });

  test('User can login - redirects from NYCID with code', async function(assert) {
    this.server.create('user', {
      emailaddress1: EMAIL,
    });

    currentSession().set('data.codeVerifier', 'test-verifier');

    this.server.get('/login', (schema, request) => {
      assert.equal(request.queryParams.code, 'test-code');
      assert.equal(request.queryParams.codeVerifier, 'test-verifier');

      return {
        access_token: 'zap-token',
        nycid: {
          email: EMAIL, sub: 'test-guid', given_name: 'Planning', family_name: 'Labs',
        },
      };
    });

    window.history.replaceState({}, '', '/login?code=test-code');

    await visit('/login?code=test-code');

    assert.equal(find('[data-test-auth-name]').textContent.trim(), EMAIL);
    assert.equal(currentURL(), '/my-projects/to-review');
  });

  test('User sees error message if the ZAP CRM authentication step fails', async function(assert) {
    this.server.get('/login', function() {
      return new Response(401, {}, { errors: [{ detail: 'We couldn\'t find your email in our system.' }] });
    }, 401);

    window.history.replaceState({}, '', '/login?code=test-code');
    await visit('/login?code=test-code');
    await waitFor('[data-test-error-message="0"]');

    assert.equal(find('[data-test-error-message="0"]').textContent.trim(), 'We couldn\'t find your email in our system.');
  });
});
