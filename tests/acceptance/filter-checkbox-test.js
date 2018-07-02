import { module, test, skip } from 'qunit';
import { visit, currentURL, click, fillIn} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | filter checkbox', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('User clicks first project status and it filters', async function(assert) {
    server.createList('project', 20);
    await visit('/projects');
    await click('.stage-checkbox li:first-child a');

    assert.equal(currentURL(), '/projects?dcp_publicstatus=Complete%2CIn%20Public%20Review');
  });

  test('User types word into Text Match search Box, and list filters', async function(assert) {
    server.createList('project', 20);
    await visit('/projects');
    await click('.filter-section-text-match .switch-paddle')
    await click('.filter-section-text-match .filter-text-input')
    await fillIn('.filter-section-text-match .filter-text-input', 'waterfront');

    assert.equal(currentURL(), '/projects?applied-filters=action-types%2Ccommunity-districts%2Cdcp_publicstatus%2Ctext_query&text_query=waterfront');
  });

  test('User clicks on first borough checkbox and it filters', async function(assert) {
    server.createList('project', 20);
    await visit('/projects');
    await click ('.filter-section-borough .switch-paddle');
    await click ('.borough-checkbox li:first-child a');

    assert.equal(currentURL(), '/projects?applied-filters=action-types%2Cboroughs%2Ccommunity-districts%2Cdcp_publicstatus&boroughs=Citywide');
  });

  test('User clicks on block search box, types in number, results list filters', async function(assert) {
    server.createList('project', 20);
    await visit ('/projects');
    await click('.filter-section-block .switch-paddle');
    await click('.filter-section-block .filter-text-input');
    await fillIn('.filter-section-block .filter-text-input', '3');

    assert.equal(currentURL(), '/projects?applied-filters=action-types%2Cblock%2Ccommunity-districts%2Cdcp_publicstatus&block=3');
  });

  test('User clicks community district box, fills in community district name, selects CD', async function(assert) {
    server.createList('project', 20);
    await visit('/projects');
    await click('.filter-section-community-district .ember-power-select-multiple-options');
    await fillIn('.filter-section-community-district .ember-power-select-multiple-options input', 'Brooklyn 1');
    await click ('.ember-power-select-options li:first-child');

    assert.equal(currentURL(), '/projects?community-districts=BK01');
  });

  test('User clicks action type box, fills in action code name, selects action code', async function(assert) {
    server.createList('project', 20);
    await visit('/projects');
    await click('.filter-section-action-type .ember-power-select-multiple-options');
    await fillIn('.filter-section-action-type .ember-power-select-multiple-options input', 'BD');
    await click('.ember-power-select-options li:first-child');

    assert.equal(currentURL(), '/projects?action-types=BD')
  });

  test('User clicks first CEQR Status and it filters', async function(assert) {
    server.createList('project', 20);
    await visit('/projects');
    await click('.filter-section-ceqr-type .switch-paddle');
    await click('.ceqr-checkbox li:first-child a');

    assert.equal(currentURL(), '/projects?applied-filters=action-types%2Ccommunity-districts%2Cdcp_ceqrtype%2Cdcp_publicstatus&dcp_ceqrtype=Type%20I%2CType%20II%2CUnknown');
  });

  test('User clicks first FEMA Flood Zone status and it filters', async function(assert) {
    server.createList('project', 20);
    await visit('/projects');
    await click('.filter-section-fema-flood-zone .switch-paddle');
    await click('.fema-checkbox li:first-child a');

    assert.equal(currentURL(), '/projects?applied-filters=action-types%2Ccommunity-districts%2Cdcp_femafloodzonea%2Cdcp_femafloodzonecoastala%2Cdcp_femafloodzoneshadedx%2Cdcp_femafloodzonev%2Cdcp_publicstatus&dcp_femafloodzonev=true');
  });

  test('User clicks first ULURP status and it filters', async function(assert) {
    server.createList('project', 20);
    await visit('/projects');
    await click('.filter-section-ulurp .switch-paddle');
    await click('.ulurp-checkbox li:first-child a');

    assert.equal(currentURL(), '/projects?applied-filters=action-types%2Ccommunity-districts%2Cdcp_publicstatus%2Cdcp_ulurp_nonulurp&dcp_ulurp_nonulurp=Non-ULURP');
  });

  test('User clicks on switch paddle and turns off filters', async function(assert) {
    server.createList('project', 20);
    await visit('/projects');
    await click('.filter-section-project-stage .switch-paddle');

    assert.equal(currentURL(), '/projects?applied-filters=action-types%2Ccommunity-districts');
  });

  test('Page reloads (pagination reset) when click new filter', async function(assert) {
    server.createList('project', 20);
    await visit('/projects?page=2');
    await click('.stage-checkbox li:first-child a');

    assert.equal(currentURL(), '/projects?dcp_publicstatus=Complete%2CIn%20Public%20Review');
  });

  skip('Reset filters button works', async function(assert) {
    server.createList('project', 20);
    await visit('/projects');
    await click('.ULURP-checkbox li:first-child a');
    await click('.ember-power-select-multiple-options');
    await fillIn('.ember-power-select-multiple-options input', 'Brooklyn 1');
    await click('.ember-power-select-options li:first-child');
    await click('.projects-reset-filters-button');

    assert.equal(currentURL(), '/projects');
  });

  test('Landing on QP default leads to cleaned URL', async function(assert) {
    server.createList('project', 20);
    await visit('/projects');
    await click('.stage-checkbox li:nth-child(1)');
    await click('.stage-checkbox li:nth-child(2)');
    await click('.stage-checkbox li:nth-child(3)');
    await click('.stage-checkbox li:nth-child(3)');
    await click('.stage-checkbox li:nth-child(2)');
    await click('.stage-checkbox li:nth-child(1)');

    assert.equal(currentURL(), '/projects');
  });

  test('User can click on filter switches with updated state', async function(assert) {
    server.createList('project', 20);
    await visit('/projects');
    await click('.filter-section-fema-flood-zone .switch-paddle');

    assert.equal(currentURL(), '/projects?applied-filters=action-types%2Ccommunity-districts%2Cdcp_femafloodzonea%2Cdcp_femafloodzonecoastala%2Cdcp_femafloodzoneshadedx%2Cdcp_femafloodzonev%2Cdcp_publicstatus');
    await click('.filter-section-fema-flood-zone .switch-paddle');

    assert.equal(currentURL(), '/projects');
  });
});
