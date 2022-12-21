import { module, test, skip } from 'qunit';
import {
  visit, find, currentURL, waitFor,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession } from 'ember-simple-auth/test-support';
import { Response } from 'ember-cli-mirage';
import jwt_decode from 'jwt-decode';

const DUMMY_TOKEN = 'eyJhbGciOiJIUzI1NiIsImN0eSI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjAzMzc2MDExLCJnaXZlbk5hbWUiOiJQbGFubmluZyIsIkdVSUQiOiIxMjM0NTY3ODkwYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoiLCJtYWlsIjoidGVzdHVzZXJAcGxhbm5pbmcubnljLmdvdiIsInNuIjoiTGFicyIsInVzZXJUeXBlIjoiRURJUlNTTyJ9.R1sbY4Edwg528S9vHq_-tG3ej5xQCtwbxGj0hxD8zBo';
const { mail } = jwt_decode(DUMMY_TOKEN);


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
      emailaddress1: mail,
    });

    // simulate presence of location hash after OAUTH redirect
    window.location.hash = `#access_token=${DUMMY_TOKEN}`;

    await visit('/login');

    assert.equal(find('[data-test-auth-name]').textContent.trim(), mail);

    assert.equal(currentURL(), '/my-projects/to-review');
  });

  skip('User sees error message if the ZAP CRM authentication step fails', async function(assert) {
    this.server.get('/login', function() {
      return new Response(401, {}, { errors: [{ detail: 'We couldn\'t find your email in our system.' }] });
    }, 401);

    // simulate presence of location hash after OAUTH redirect
    window.location.hash = `#access_token=${DUMMY_TOKEN}`;
    await visit('/login');
    await waitFor('[data-test-error-message="0"]');

    assert.equal(find('[data-test-error-message="0"]').textContent.trim(), 'We couldn\'t find your email in our system.');
  });
});
