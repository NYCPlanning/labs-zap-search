import { module, test } from 'qunit';
import {
  visit,
  find,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { invalidateSession } from 'ember-simple-auth/test-support';
import jwt_decode from 'jwt-decode';

const DUMMY_TOKEN = 'eyJhbGciOiJIUzI1NiIsImN0eSI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjAzMzc2MDExLCJnaXZlbk5hbWUiOiJQbGFubmluZyIsIkdVSUQiOiIxMjM0NTY3ODkwYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoiLCJtYWlsIjoidGVzdHVzZXJAcGxhbm5pbmcubnljLmdvdiIsInNuIjoiTGFicyIsInVzZXJUeXBlIjoiRURJUlNTTyJ9.R1sbY4Edwg528S9vHq_-tG3ej5xQCtwbxGj0hxD8zBo';
const { mail } = jwt_decode(DUMMY_TOKEN);

module('Acceptance | dev features are hidden in staging and prod', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    this.server.create('project', {
      id: 1,
    });

    this.server.create('user', {
      emailaddress1: mail,
    });

    window.location.hash = '';

    await invalidateSession();
  });

  test('Unauthenticated user sees sign-in feature if environment is development or test', async function(assert) {
    await visit('/');

    assert.ok(find('[data-test-auth-login-button]'));
  });

  test('Authenticated user sees sign-in feature if environment is development or test', async function(assert) {
    // simulate presence of location hash after OAUTH redirect
    window.location.hash = `#access_token=${DUMMY_TOKEN}`;

    await visit('/login');

    assert.ok(find('[data-test-auth-name]'));

    assert.ok(find('[data-test-auth-logout-button]'));
  });

  test('Unauthenticated user does not see sign-in feature if environment is staging or prod', async function(assert) {
    // visit root route first to instantiate application controller
    await visit('/');

    const applicationController = this.owner.lookup('controller:application');

    applicationController.set('ENV', { environment: 'staging' });

    // reload page, since applicationController.ENV is not a computed
    await visit('/');

    assert.notOk(find('[data-test-auth-login-button]'));

    applicationController.set('ENV', { environment: 'production' });

    await visit('/');

    assert.notOk(find('[data-test-auth-login-button]'));
  });

  // A user could still "sign in" via api, but the sign-in feature would be visually hidden
  test('Authenticated user does not see sign-in feature if environment is staging or prod', async function(assert) {
    // visit root route first to instantiate application controller
    await visit('/');

    const applicationController = this.owner.lookup('controller:application');

    applicationController.set('ENV', { environment: 'staging' });

    // reload page, since applicationController.ENV is not a computed
    await visit('/');

    // simulate presence of location hash after OAUTH redirect
    window.location.hash = `#access_token=${DUMMY_TOKEN}`;

    await visit('/login');

    assert.notOk(find('[data-test-auth-name]'));
    assert.notOk(find('[data-test-auth-logout-button]'));

    applicationController.set('ENV', { environment: 'production' });

    await visit('/');

    assert.notOk(find('[data-test-auth-name]'));
    assert.notOk(find('[data-test-auth-logout-button]'));
  });
});
