import { module, test, skip } from 'qunit';
import {
  visit,
  currentURL,
  click,
  fillIn,
  find,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { selectChoose } from 'ember-power-select/test-support';

module('Acceptance | filter checkbox', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('User clicks Completed project status and it filters', async function(assert) {
    server.createList('project', 20);
    await visit('/');
    await click('[data-test-status-checkbox="Completed"]');

    assert.equal(currentURL().includes('Completed'), true);
  });

  test('User clicks first FEMA Flood Zone status and it filters', async function(assert) {
    server.createList('project', 20);
    await visit('/');
    await click('[data-test-flood-zone-a-checkbox]');

    assert.equal(currentURL().includes('dcp_femafloodzonea=true'), true);
  });

  test('User clicks radius filter checkbox', async function(assert) {
    server.createList('project', 20);
    await visit('/');
    await click('[data-test-filter-section="filter-section-radius-filter"] .switch-paddle');

    assert.equal(currentURL().includes('distance_from_point'), true);
    assert.equal(currentURL().includes('radius_from_point'), true);
  });

  test('User clicks community district box, fills in community district name, selects CD', async function(assert) {
    server.createList('project', 20);
    await visit('/');
    await click('[data-test-filter-control="filter-section-community-district"] .ember-power-select-multiple-options');
    await fillIn('[data-test-filter-control="filter-section-community-district"] .ember-power-select-multiple-options input', 'Brooklyn');
    await selectChoose('.community-district-dropdown-selection', 'Brooklyn 2');

    assert.equal(currentURL(), '/projects?applied-filters=community-districts%2Cdcp_publicstatus&community-districts=K02');
  });

  test('User clicks action box, fills in action name, selects action type', async function(assert) {
    server.createList('project', 20);
    await visit('/');
    await click('[data-test-filter-section="filter-section-action-type"] .switch-paddle');
    await click('[data-test-filter-control="filter-section-action-type"] .ember-power-select-multiple-options');
    // Choose the second option in the select options, which is "BF - Business Franchise".
    // Due to how we format the "action-type" options text, ember-power-select has difficulty selecting the text,
    // so we use an index number instead.
    await selectChoose('[data-test-filter-control="filter-section-action-type"]', '.ember-power-select-option', 1);

    assert.equal(currentURL(), '/projects?action-types=BF&applied-filters=action-types%2Cdcp_publicstatus');
  });

  test('User clicks zoning resolution box, fills in zoning resolution name, selects zoning resolution type', async function(assert) {
    server.createList('project', 20);

    this.server.create('zoning-resolution', 1, {
      dcpZoningresolution: 'AppendixD',
    });
    this.server.create('zoning-resolution', 2, {
      dcpZoningresolution: 'AppendixF',
    });
    this.server.create('zoning-resolution', 3, {
      dcpZoningresolution: '74-116',
    });

    await visit('/');
    await click('[data-test-filter-section="filter-section-zoning-resolutions"] .switch-paddle');
    await click('[data-test-filter-control="filter-section-zoning-resolutions"] .ember-power-select-multiple-options');
    // Choose the second option in the select options, which is "AppendixF", which has an id of 2.
    // Due to how we format the "action-type" options text, ember-power-select has difficulty selecting the text,
    // so we use an index number instead.
    await selectChoose('[data-test-filter-control="filter-section-zoning-resolutions"]', '.ember-power-select-option', 1);

    // since we query _dcp_zoningresolution_value on the dcp_projectaction entity, our queryparam here is an id
    // rather than the name of the zoning resolution
    assert.equal(currentURL(), '/projects?applied-filters=dcp_publicstatus%2Czoning-resolutions&zoning-resolutions=2');
  });

  test('User clicks ULURP checkbox and it filters', async function(assert) {
    server.createList('project', 20);
    await visit('/');
    await click('[data-test-nonulurp-checkbox]');

    assert.equal(currentURL().includes('dcp_ulurp_nonulurp=Non-ULURP'), true);
  });

  skip('User clicks CEQR checkbox and it filters', async function(assert) {
    server.createList('project', 20);
    await visit('/');
    await click('[data-test-technical-memorandum-checkbox]');

    assert.equal(currentURL().includes('dcp_easeis=Technical%20Memorandum'), true);
  });

  skip('Page reloads (pagination reset) when click new filter', async function(assert) {
    server.createList('project', 20);
    await visit('/projects');
    await click('[data-test-status-checkbox="Filed"]');

    assert.equal(currentURL(), '/projects');
  });

  test('Reset filters button works', async function(assert) {
    server.createList('project', 20);
    await visit('/projects');
    await click('[data-test-filter-control="filter-section-community-district"] .ember-power-select-multiple-options');
    await fillIn('[data-test-filter-control="filter-section-community-district"] .ember-power-select-multiple-options input', 'Brooklyn 3');
    await selectChoose('.community-district-dropdown-selection', 'Brooklyn 3');
    await click('.projects-reset-filters-button');

    assert.equal(currentURL(), '/projects');
  });

  test('Landing on QP default leads to cleaned URL', async function(assert) {
    server.createList('project', 20);
    await visit('/projects');
    await click('[data-test-status-checkbox="Filed"]');
    await click('[data-test-status-checkbox="In Public Review"]');
    await click('[data-test-status-checkbox="Completed"]');
    await click('[data-test-status-checkbox="Completed"]');
    await click('[data-test-status-checkbox="In Public Review"]');
    await click('[data-test-status-checkbox="Filed"]');

    assert.equal(currentURL(), '/projects');
  });

  test('User can click on filter switches with updated state', async function(assert) {
    server.createList('project', 20);
    await visit('/projects');
    await click('[data-test-filter-section="filter-section-fema-flood-zone"] .switch-paddle');

    assert.equal(currentURL(), '/projects?applied-filters=dcp_femafloodzonea%2Cdcp_femafloodzoneshadedx%2Cdcp_publicstatus');
    await click('[data-test-filter-section="filter-section-fema-flood-zone"] .switch-paddle');

    assert.equal(currentURL(), '/projects');
  });

  test('Clicking unapplied filter enables it', async function(assert) {
    server.createList('project', 20);

    await visit('/projects');
    await find('[data-test-filter-control="filter-section-text-match"].inactive');
    await fillIn('[data-test-filter-control="filter-section-text-match"] .filter-text-input', 'peanut butter');
    await find('[data-test-filter-control="filter-section-text-match"].active');

    assert.equal(currentURL().includes('project_applicant_text'), true);
    assert.equal(currentURL().includes('applied-filters'), true);

    await find('[data-test-filter-control="filter-section-borough-/-block"].inactive');
    await click('[data-test-borough-checkbox="Citywide"]');
    await click('[data-test-borough-checkbox="Manhattan"]');
    await click('[data-test-borough-checkbox="Bronx"]');
    await find('[data-test-filter-control="filter-section-borough-/-block"].active');

    assert.equal(currentURL().includes('boroughs=Bronx%2CCitywide%2CManhattan'), true);

    await find('[data-test-filter-control="filter-section-fema-flood-zone"].inactive');
    await click('[data-test-flood-zone-a-checkbox]');
    await find('[data-test-filter-control="filter-section-fema-flood-zone"].active');
    assert.equal(currentURL().includes('dcp_femafloodzonea=true'), true);
  });
});
