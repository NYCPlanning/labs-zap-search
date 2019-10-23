import { module, test } from 'qunit';
import {
  visit,
  find,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession, authenticateSession } from 'ember-simple-auth/test-support';
import moment from 'moment';

module('Acceptance | upcoming project cards renders', function(hooks) {
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

  test('upcoming project card renders fuzzy date if public review is more than 30 days away', async function(assert) {
    this.server.create('user', {
      id: 1,
      email: 'qncb5@planning.nyc.gov',
      landUseParticipant: 'QNBP',
      assignments: [
        this.server.create('assignment', {
          id: 1,
          tab: 'upcoming',
          dcpLupteammemberrole: 'BP',
          dispositions: [],
          project: this.server.create('project', {
            dcpPublicstatusSimp: 'Filed',
            milestones: [
              this.server.create('milestone', 'communityBoardReview', {
                dcpPlannedstartdate: moment().add(32, 'days'),
              }),
            ],
          }),
        }),
      ],
    });

    await authenticateSession({
      id: 1,
    });

    await visit('/my-projects/upcoming');

    const timeRemainingValue = find('[data-test-fuzzy-time-remaining]').textContent.trim();
    assert.equal(timeRemainingValue, 'over 30 days', 'Time remaining displays over 30 days');
    assert.notOk(find('[data-test-time-remaining]'));
  });

  test('upcoming project card renders fuzzy date if public review is under 30 days away', async function(assert) {
    this.server.create('user', {
      id: 1,
      email: 'qncb5@planning.nyc.gov',
      landUseParticipant: 'QNBP',
      assignments: [
        this.server.create('assignment', {
          id: 1,
          tab: 'upcoming',
          dcpLupteammemberrole: 'BP',
          dispositions: [],
          project: this.server.create('project', {
            dcpPublicstatusSimp: 'Filed',
            milestones: [this.server.create('milestone', 'communityBoardReview', {
              dcpPlannedstartdate: moment().add(15, 'days'),
            })],
          }),
        }),
      ],
    });

    await authenticateSession({
      id: 1,
    });

    await visit('/my-projects/upcoming');

    const timeRemainingValue = find('[data-test-fuzzy-time-remaining]').textContent.trim();
    assert.equal(timeRemainingValue, 'under 30 days', 'Time remaining displays under 30 days');
    assert.notOk(find('[data-test-time-remaining]'));
  });

  test('upcoming project card renders estimated start date if public review has begun', async function(assert) {
    this.server.create('user', {
      id: 1,
      email: 'qncb5@planning.nyc.gov',
      landUseParticipant: 'QNBP',
      assignments: [
        this.server.create('assignment', {
          id: 1,
          tab: 'upcoming',
          dcpLupteammemberrole: 'BP',
          dispositions: [],
          project: this.server.create('project', {
            dcpPublicstatusSimp: 'In Public Review',
            milestones: [
              this.server.create('milestone', 'communityBoardReview', {
              }),
              this.server.create('milestone', 'boroughPresidentReview', {
                dcpPlannedstartdate: '11/30/2019',
              }),
            ],
          }),
        }),
      ],
    });

    await authenticateSession({
      id: 1,
    });

    await visit('/my-projects/upcoming');

    const timeRemainingValue = find('[data-test-time-remaining]').textContent.trim();
    assert.equal(timeRemainingValue, '11/30/2019', 'Estimated start is 11/30/2019');
    assert.notOk(find('[data-test-fuzzy-time-remaining]'));
  });

  test('upcoming project card defaults to fuzzy date if project.dcpPublicstatusSimp is undefined', async function(assert) {
    this.server.create('user', {
      id: 1,
      email: 'qncb5@planning.nyc.gov',
      landUseParticipant: 'QNBP',
      assignments: [
        this.server.create('assignment', {
          id: 1,
          tab: 'upcoming',
          dcpLupteammemberrole: 'BP',
          dispositions: [],
          project: this.server.create('project', {
            dcpPublicstatusSimp: '',
            milestones: [this.server.create('milestone', 'communityBoardReview', {
              // note how Community Board Review has already started, but we still display
              // the fuzzy public review start date ('under 30 days')
              dcpPlannedstartdate: moment().subtract(15, 'days'),
            })],
          }),
        }),
      ],
    });

    await authenticateSession({
      id: 1,
    });

    await visit('/my-projects/upcoming');

    const timeRemainingValue = find('[data-test-fuzzy-time-remaining]').textContent.trim();
    assert.equal(timeRemainingValue, 'under 30 days', 'Time remaining displays under 30 days');
    assert.notOk(find('[data-test-time-remaining]'));
  });
});
