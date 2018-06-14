import { module, test } from 'qunit';
import { visit, currentURL, fillIn, triggerKeyEvent, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | user searches address', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting / to search for address', async function(assert) {
    server.createList('project', 10);
    server.createList('geography', 10);
    window.XMLHttpRequestFake = window.XMLHttpRequest;

    await visit('/');
    await fillIn('.map-search-input', '120 broadway');
    await triggerKeyEvent('.labs-geosearch', 'keypress', 13);

    assert.equal(currentURL(), '/geographies/mn-1');
  });


  test('user can click first project in recent projects', async function(assert) {
    server.createList('project', 10);
    server.createList('geography', 10);
    window.XMLHttpRequestFake = window.XMLHttpRequest;
    await visit('/');
    await click('.projects-list li:first-child a'); 

    // actions here

    assert.equal(currentURL(), '/projects/1');
  });

    test('user can click on site title and return to index page', async function(assert) {
    server.createList('project', 10);
    server.createList('geography', 10);
    window.XMLHttpRequestFake = window.XMLHttpRequest;
    await visit('/projects/1');
    await click('.site-name'); 

    // actions here

    assert.equal(currentURL(), '/');
  });

    test('user clicks on Planning Labs Logo and visits Planning Website', async function(assert) {
    server.createList('project', 10);
    server.createList('geography', 10);
    window.XMLHttpRequestFake = window.XMLHttpRequest;
    await visit('/');
    await click('.dcp-link'); 

    // actions here

    assert.equal(currentURL(), '/');
  }); 



});

// function () {
//   return 'something';
// }

// // returns a promise

// function() {
//   return fetch('http://example.com/movies.json')
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(myJson) {
//     console.log(myJson);
//   });
// }

// async function () {
//   const response = await fetch('http://example.com/movies.json');
//   return response.json();
// }
