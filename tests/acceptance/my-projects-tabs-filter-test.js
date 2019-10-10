import { module, test } from 'qunit';
import {
  visit,
  currentURL,
  findAll,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession } from 'ember-simple-auth/test-support';

// NOTE: This suite assumes user 1 is logged in.
module('Acceptance | my projects tabs filter', function(hooks) {
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

  test('Correct number of projects displayed in each tab based on tab property in projects', async function(assert) {
    // ##### PROJECTS FOR USER ################################################
    // upcoming
    const userProject1 = server.create('project', {
      id: 1,
      dcp_name: 'N2018Q077',
      tab: 'upcoming',
    });

    // upcoming
    const userProject2 = server.create('project', {
      id: 2,
      dcp_name: 'P2012M046',
      tab: 'upcoming',
    });

    // to-review
    const userProject3 = server.create('project', {
      id: 3,
      dcp_name: 'K1993M046',
      tab: 'to-review',
    });

    // to-review
    const userProject4 = server.create('project', {
      id: 4,
      dcp_name: 'N2018Q077',
      tab: 'to-review',
    });

    // to-review
    const userProject5 = server.create('project', {
      id: 5,
      dcp_name: 'M2005Q077',
      tab: 'to-review',
    });

    // reviewed
    const userProject6 = server.create('project', {
      id: 6,
      dcp_name: 'P1982K004',
      tab: 'reviewed',
    });

    // archive
    const userProject7 = server.create('project', {
      id: 7,
      dcp_name: 'P2001B002',
      tab: 'archive',
    });

    // ##### PROJECTS ################################################
    // upcoming
    this.server.create('project', {
      id: 1,
      dcp_name: 'N2018Q077',
      tab: 'upcoming',
    });

    // upcoming
    this.server.create('project', {
      id: 2,
      dcp_name: 'P2012M046',
      tab: 'upcoming',
    });

    // to-review
    this.server.create('project', {
      id: 3,
      dcp_name: 'K1993M046',
      tab: 'to-review',
    });

    // to-review
    this.server.create('project', {
      id: 4,
      dcp_name: 'N2018Q077',
      tab: 'to-review',
    });

    // to-review
    this.server.create('project', {
      id: 5,
      dcp_name: 'M2005Q077',
      tab: 'to-review',
    });

    // reviewed
    this.server.create('project', {
      id: 6,
      dcp_name: 'P1982K004',
      tab: 'reviewed',
    });

    // archive
    this.server.create('project', {
      id: 7,
      dcp_name: 'P2001B002',
      tab: 'archive',
    });

    this.server.create('user', {
      emailaddress1: 'testuser@planning.nyc.gov',
      projects: [userProject1, userProject2, userProject3, userProject4, userProject5, userProject6, userProject7],
    });

    // simulate presence of location hash after OAUTH redirect
    window.location.hash = '#access_token=test';

    await visit('/login');

    // ##### upcoming ##########################################################
    await visit('/my-projects/upcoming');

    assert.equal(currentURL(), '/my-projects/upcoming');

    assert.equal(findAll('[data-test-project-card]').length, 2, 'Number of displayed projects is same as number of users upcoming projects');

    // ##### to-review ##########################################################
    await visit('/my-projects/to-review');

    assert.equal(currentURL(), '/my-projects/to-review');

    assert.equal(findAll('[data-test-project-card]').length, 3, 'Number of displayed projects is same as number of users to-review projects');

    // ##### reviewed ##########################################################
    await visit('/my-projects/archive');

    assert.equal(currentURL(), '/my-projects/archive');

    assert.equal(findAll('[data-test-project-card]').length, 1, 'Number of displayed projects is same as number of users reviewed projects');

    // ##### archive ##########################################################
    await visit('/my-projects/archive');

    assert.equal(currentURL(), '/my-projects/archive');

    assert.equal(findAll('[data-test-project-card]').length, 1, 'Number of displayed projects is same as number of users archive projects');
  });
});
