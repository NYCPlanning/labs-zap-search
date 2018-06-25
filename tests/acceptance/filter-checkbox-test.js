import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | filter checkbox', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('User clicks first project status and it filters', async function(assert) {
    server.createList('project', 20);
    await visit('/');
    await click('.status-checkbox li:first-child a');

    assert.equal(currentURL(), '/projects?dcp_publicstatus=Approved%2CCertified%2CWithdrawn');
  });

  test('User clicks first CEQR Status and it filters', async function(assert) {
    server.createList('project', 20);
    await visit('/');
    await click('.CEQR-checkbox li:first-child a');

    assert.equal(currentURL(), '/projects?dcp_ceqrtype=Type%20I%2CType%20II%2CUnknown');
  });

  test('User clicks first FEMA Flood Zone status and it filters', async function(assert) {
    server.createList('project', 20);
    await visit('/');
    await click('.FEMA-checkbox li:first-child a');

    assert.equal(currentURL(), '/projects?dcp_femafloodzonea=true');
  });

  test('User clicks first ULURP status and it filters', async function(assert) {
    server.createList('project', 20);
    await visit('/');
    await click('.ULURP-checkbox li:first-child a');

    assert.equal(currentURL(), '/projects?dcp_ulurp_nonulurp=Non-ULURP');
  });

  test('User clicks community district box, fills in community district name, selects CD', async function(assert) {
    server.createList('project', 20);
    await visit('/');
    await click('.ember-power-select-multiple-options');
    await fillIn('.ember-power-select-multiple-options input', 'Brooklyn 1');
    await click ('.ember-power-select-options li:first-child');

    assert.equal(currentURL(), '/projects?community-districts=BK01');
  });

  test('Page reloads (pagination reset) when click new filter', async function(assert) {
    server.createList('project', 20);
    await visit('/projects?page=2');
    await click('.status-checkbox li:first-child a');

    assert.equal(currentURL(), '/projects?dcp_publicstatus=Approved%2CCertified%2CWithdrawn');
  });

  test('Page reloads (pagination reset) when click new filter', async function(assert) {
    server.createList('project', 20);
    await visit('/projects?page=2');
    await click('.status-checkbox li:first-child a');

    assert.equal(currentURL(), '/projects?dcp_publicstatus=Approved%2CCertified%2CWithdrawn');
  });
});
