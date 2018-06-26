import { module, test } from 'qunit';
import { visit, currentURL, click, find, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | append only search results work', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /projects?community-districts=asdf', async function(assert) {
    server.createList('project', 10);
    await visit('/projects?community-districts=asdf');
    assert.equal(currentURL(), '/projects?community-districts=asdf');
  });

  test('visiting /projects?community-districts=asdf', async function(assert) {
    server.createList('project', 60);
    await visit('/projects?community-districts=asdf');
    const listResults = await findAll('li.projects-list-result');

    // DEFAULTS TO 30 RESULTS PER PAGE
    assert.equal(listResults.length, 30);

    await click('.projects-load-more-button');

    assert.equal(currentURL(), '/projects?community-districts=asdf&page=2');

    const listResults2 = await findAll('li.projects-list-result');

    // DEFAULTS TO 30 RESULTS PER PAGE
    assert.equal(listResults2.length, 60);
  });

  test('Reaching end of list disables "load more" button', async function(assert) {
    server.createList('project', 40);
    await visit('/projects?community-districts=asdf');
    const listResults = await findAll('li.projects-list-result');

    // DEFAULTS TO 30 RESULTS PER PAGE
    assert.equal(listResults.length, 30);

    await click('.projects-load-more-button');

    const loadMoreButton = await find('.projects-load-more-button');

    // should be disabled
    assert.equal(!!loadMoreButton.attributes.disabled, true);

    await click('.projects-load-more-button');

    // should not increase page number
    assert.equal(currentURL(), '/projects?community-districts=asdf&page=2')
  });
});
