import { module, test } from 'qunit';
import {
  visit,
  find,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession, authenticateSession } from 'ember-simple-auth/test-support';
import moment from 'moment';

module('Acceptance | to review project cards renders', function(hooks) {
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

  test('to-review project card renders due date if milestone dates are valid', async function(assert) {
    this.server.create('user', {
      id: 1,
      email: 'qncb5@planning.nyc.gov',
      landUseParticipant: 'QNBP',
      assignments: [
        this.server.create('assignment', {
          id: 1,
          tab: 'to-review',
          dcpLupteammemberrole: 'BP',
          dispositions: [],
          project: this.server.create('project', {
            milestones: [this.server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'In Progress',
              dcpActualstartdate: moment().subtract(9, 'days'),
              displayDate: moment().subtract(9, 'days'),
              dcpActualenddate: moment().add(21, 'days'),
              displayDate2: moment().add(21, 'days'),
            })],
          }),
        }),
      ],
    });

    await authenticateSession({
      id: 1,
    });

    await visit('/my-projects/to-review');

    const timeRemainingValue = find('[data-test-time-remaining]').textContent.trim();
    assert.equal(timeRemainingValue, '20', 'Time remaining displays 20');
  });

  test('to-review project card renders a "contact DCP" message if milestone dates are invalid', async function(assert) {
    this.server.create('user', {
      id: 1,
      email: 'qncb5@planning.nyc.gov',
      landUseParticipant: 'QNBP',
      assignments: [
        this.server.create('assignment', {
          id: 1,
          tab: 'to-review',
          dcpLupteammemberrole: 'BP',
          dispositions: [],
          project: this.server.create('project', {
            milestones: [this.server.create('milestone', 'boroughPresidentReview', {
              statuscode: 'In Progress',
              dcpActualstartdate: moment().subtract(9, 'days'),
              displayDate: moment().subtract(9, 'days'),
              dcpActualenddate: null,
              displayDate2: null,
              dcpPlannedenddate: moment().subtract(21, 'days'),
            })],
          }),
        }),
      ],
    });

    await authenticateSession({
      id: 1,
    });

    await visit('/my-projects/to-review');

    assert.notOk(find('[data-test-time-remaining]'));

    assert.ok(find('[data-test-invalid-milestone-end-date]'));
  });
});
