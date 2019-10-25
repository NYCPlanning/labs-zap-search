import { module, test } from 'qunit';
import {
  visit,
  find,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession, authenticateSession } from 'ember-simple-auth/test-support';
import moment from 'moment';

module('Acceptance | reviewed project cards renders', function(hooks) {
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

  test('reviewed project card renders an estimated time remaining if planned end date is valid', async function(assert) {
    this.server.create('user', {
      id: 1,
      email: 'qncb5@planning.nyc.gov',
      landUseParticipant: 'QNCB',
      assignments: [
        this.server.create('assignment', {
          id: 1,
          tab: 'reviewed',
          dcpLupteammemberrole: 'CB',
          dispositions: [],
          project: this.server.create('project', {
            milestones: [this.server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'In Progress',
              dcpActualstartdate: moment().subtract(9, 'days'),
              displayDate: moment().subtract(9, 'days'),
              dcpPlannedcompletiondate: moment().add(15, 'days'),
              displayDate2: null,
            })],
          }),
        }),
      ],
    });

    await authenticateSession({
      id: 1,
    });

    await visit('/my-projects/reviewed');

    const timeRemainingValue = find('[data-test-estimated-time-remaining]').textContent.trim();
    assert.equal(timeRemainingValue, '14', 'Estimated time remaining displays 14');
  });
});
