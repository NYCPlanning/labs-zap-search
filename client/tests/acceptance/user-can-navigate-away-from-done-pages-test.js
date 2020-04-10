import { module, test } from 'qunit';
import {
  click,
  visit,
  currentURL,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession, authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | user can navigate away from done pages', function(hooks) {
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

  test('user can navigate from the recommendation/done page to project profile', async function(assert) {
    this.server.create('user', {
      id: 1,
      emailaddress1: 'testuser@planning.nyc.gov',
      assignments: [
        this.server.create('assignment', {
          id: 1,
          tab: 'to-review',
          dcpLupteammemberrole: 'CB',
          dispositions: [
            this.server.create('disposition', {
              dcpPublichearinglocation: 'Canal street',
              dcpDateofpublichearing: '11/12/2019',
              action: this.server.create('action'),
            }),
          ],
          project: this.server.create('project', {
            id: 2,
            actions: this.server.schema.actions.all(),
            assignments: this.server.schema.assignments.all(),
            dispositions: this.server.schema.dispositions.all(),
            users: this.server.schema.users.all(),
          }),
        }),
      ],
    });

    await authenticateSession({
      id: 1,
    });

    await visit('/my-projects/1/recommendations/done');
    assert.equal(currentURL(), '/my-projects/1/recommendations/done');

    await click('[data-test-button="back-to-project-profile"]');
    assert.equal(currentURL(), '/projects/2');
  });

  test('user can navigate from the recommendation/done page to to-review page', async function(assert) {
    this.server.create('user', {
      id: 1,
      emailaddress1: 'testuser@planning.nyc.gov',
      assignments: [
        this.server.create('assignment', {
          id: 1,
          tab: 'to-review',
          dcpLupteammemberrole: 'CB',
          dispositions: [
            this.server.create('disposition', {
              dcpPublichearinglocation: 'Canal street',
              dcpDateofpublichearing: '11/12/2019',
              action: this.server.create('action'),
            }),
          ],
          project: this.server.create('project', {
            id: 2,
            actions: server.schema.actions.all(),
            assignments: server.schema.assignments.all(),
            dispositions: server.schema.dispositions.all(),
          }),
        }),
      ],
    });

    await authenticateSession({
      id: 1,
    });

    await visit('/my-projects/1/recommendations/done');
    assert.equal(currentURL(), '/my-projects/1/recommendations/done');

    await click('[data-test-button="back-to-review"]');

    assert.equal(currentURL(), '/my-projects/to-review');
  });

  test('user can navigate from the hearing/done page to project profile', async function(assert) {
    this.server.create('user', {
      id: 1,
      emailaddress1: 'testuser@planning.nyc.gov',
      assignments: [
        this.server.create('assignment', {
          id: 1,
          tab: 'to-review',
          dcpLupteammemberrole: 'CB',
          dispositions: [
            this.server.create('disposition', {
              dcpPublichearinglocation: 'Canal street',
              dcpDateofpublichearing: '11/12/2019',
              action: this.server.create('action'),
            }),
          ],
          project: this.server.create('project', {
            id: 2,
            actions: this.server.schema.actions.all(),
            assignments: this.server.schema.assignments.all(),
            dispositions: this.server.schema.dispositions.all(),
            users: this.server.schema.users.all(),
          }),
        }),
      ],
    });

    await authenticateSession({
      id: 1,
    });

    await visit('/my-projects/1/hearing/done');
    assert.equal(currentURL(), '/my-projects/1/hearing/done');

    await click('[data-test-button="back-to-project-profile"]');
    assert.equal(currentURL(), '/projects/2');
  });

  test('user can navigate from the hearing/done page to to-review page', async function(assert) {
    this.server.create('user', {
      id: 1,
      emailaddress1: 'testuser@planning.nyc.gov',
      assignments: [
        this.server.create('assignment', {
          id: 1,
          tab: 'to-review',
          dcpLupteammemberrole: 'CB',
          dispositions: [
            this.server.create('disposition', {
              dcpPublichearinglocation: 'Canal street',
              dcpDateofpublichearing: '11/12/2019',
              action: this.server.create('action'),
            }),
          ],
          project: this.server.create('project', {
            id: 2,
            actions: server.schema.actions.all(),
            assignments: server.schema.assignments.all(),
            dispositions: server.schema.dispositions.all(),
          }),
        }),
      ],
    });

    await authenticateSession({
      id: 1,
    });

    await visit('/my-projects/1/hearing/done');
    assert.equal(currentURL(), '/my-projects/1/hearing/done');

    await click('[data-test-button="back-to-review"]');

    assert.equal(currentURL(), '/my-projects/to-review');
  });
});
