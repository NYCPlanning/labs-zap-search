import { module, skip } from 'qunit';
import {
  visit,
  currentURL,
  fillIn,
  triggerKeyEvent,
  click,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | user searches address', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  // no longer relevant
  skip('visiting / to search for address', async function(assert) {
    server.createList('project', 10);

    await visit('/');
    await click('.site-name');
    await fillIn('.map-search-input', '120 broadway');
    await triggerKeyEvent('.labs-geosearch', 'keypress', 13);

    assert.equal(currentURL(), '/projects?community-districts=M01');
  });


  skip('user can click first project in recent projects', async function(assert) {
    server.createList('project', 10);
    await visit('/');
    await click('.site-name');
    await click('.projects-list li:first-child a');

    // actions here

    assert.equal(currentURL(), '/projects/1');
  });

  skip('user can click on site title and return to index page', async function(assert) {
    server.createList('project', 10);
    await visit('/projects/1');
    await click('.site-name');

    // actions here

    assert.equal(currentURL(), '/');
  });
});
