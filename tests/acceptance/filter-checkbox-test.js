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

  test('User clicks first project status and it filters', async function(assert) {
    server.createList('project', 20);
    await visit('/');
    await click('[data-test-status-checkbox="Filed"]');

    assert.equal(currentURL().includes('Filed'), true);
  });

  test('User clicks first FEMA Flood Zone status and it filters', async function(assert) {
    server.createList('project', 20);
    await visit('/');
    await click('[data-test-flood-v-checkbox]');

    assert.equal(currentURL().includes('dcp_femafloodzonev=true'), true);
  });

  test('User clicks community district box, fills in community district name, selects CD', async function(assert) {
    server.createList('project', 20);
    await visit('/');
    await click('[data-test-filter-control="filter-section-community-district"] .ember-power-select-multiple-options');
    await fillIn('[data-test-filter-control="filter-section-community-district"] .ember-power-select-multiple-options input', 'Brooklyn');
    await selectChoose('.community-district-dropdown-selection', 'Brooklyn 2');

    assert.equal(currentURL(), '/projects?applied-filters=community-districts%2Cdcp_certifiedreferred&community-districts=BK02');
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

    assert.equal(currentURL(), '/projects?applied-filters=dcp_certifiedreferred%2Cdcp_publicstatus');
  });

  test('User can click on filter switches with updated state', async function(assert) {
    server.createList('project', 20);
    await visit('/projects');
    await click('[data-test-filter-section="filter-section-fema-flood-zone"] .switch-paddle');

    assert.equal(currentURL(), '/projects?applied-filters=dcp_certifiedreferred%2Cdcp_femafloodzonea%2Cdcp_femafloodzonecoastala%2Cdcp_femafloodzoneshadedx%2Cdcp_femafloodzonev');
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
    await click('[data-test-flood-v-checkbox]');
    await find('[data-test-filter-control="filter-section-fema-flood-zone"].active');
    assert.equal(currentURL().includes('dcp_femafloodzonev=true'), true);
  });
});
