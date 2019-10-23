import { module, test } from 'qunit';
import { visit, currentURL, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';
import moment from 'moment';

module('Acceptance | 768 limit reorder milestones upcoming tab', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /768-limit-reorder-milestones-upcoming-tab', async function(assert) {
    this.server.create('user', {
      id: 1,
      email: 'qncb5@planning.nyc.gov',
      landUseParticipant: 'QNBP', // "boroughPresidentReview" milestone
      assignments: [
        this.server.create('assignment', {
          project: this.server.create('project', {
            milestones: [
              // "first" milestone
              this.server.create('milestone', 'prepareFiledLandUseApplication', 'isCompleted', { id: 1 }), // 0
              this.server.create('milestone', 'landUseFeePaid', 'isCompleted', { id: 2 }),
              this.server.create('milestone', 'eisDraftScopeReview', 'isCompleted', { id: 3 }),

              // "last completed" milestone
              this.server.create('milestone', 'ceqrFeePayment', 'isCompleted', { id: 4 }), // 1
              this.server.create('milestone', 'filedEasReview', 'isInProgress', { id: 5 }), // 2
              this.server.create('milestone', 'eisPublicScopingMeeting', 'isInProgress', { id: 6 }), // 3
              this.server.create('milestone', 'finalScopeOfWorkIssued', 'isInProgress', { id: 7 }), // 4
              this.server.create('milestone', 'nocOfDraftIssued', 'isInProgress', { id: 8 }), // 5
              this.server.create('milestone', 'deisPublicHearingHeld', 'isInProgress', { id: 9 }), // 6
              this.server.create('milestone', 'feisPublicSubmittedAndReview', 'isNotStarted', { id: 10 }), // 7
              this.server.create('milestone', 'certifiedReferred', 'isNotStarted', { id: 11 }), // 8

              // "LUP"-specific milestones
              this.server.create('milestone', 'communityBoardReview', 'isNotStarted', { id: 12 }), // 9
              this.server.create('milestone', 'boroughPresidentReview', 'isNotStarted', { id: 13 }), // 10
              this.server.create('milestone', 'boroughBoardReview', 'isNotStarted', { id: 14 }),
            ],
          }),
          tab: 'upcoming',
          dcpPublicstatus: 'Certified',
          dcpLupteammemberrole: 'BP',
          dispositions: [],
        }),
      ],
    });

    await authenticateSession({
      id: 1,
    });

    await visit('/my-projects/upcoming');

    const firstMilestone = find('[data-test-milestone-id="1"]');
    assert.equal(firstMilestone.getAttribute('data-test-display-order'), 0);

    const firstCompleted = find('[data-test-milestone-id="4"]');
    assert.equal(firstCompleted.getAttribute('data-test-display-order'), 1);

    const firstLUPMilestone = find('[data-test-milestone-id="13"]');
    assert.equal(firstLUPMilestone.getAttribute('data-test-display-order'), 10);
  });
});
