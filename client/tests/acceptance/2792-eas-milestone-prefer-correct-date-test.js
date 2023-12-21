import { module, test } from 'qunit';
import { visit, find, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | 2792 eas milestone prefer correct date', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('eas prefer correct date for projects beginning with P', async function(assert) {
    this.server.create('project', {
      dcpName: 'P1234',
      milestones: [
        this.server.create('milestone', 'isCompleted', 'filedEasReview', {
          id: 1,
          dcpActualstartdate: '9/9/9',
        }),
        this.server.create('milestone', 'isCompleted', {
          dcpMilestone: '723beec4-dad0-e711-8116-1458d04e2fb8', // prepared eas
          dcpActualenddate: '1/1/1',
        }),
      ],
    });
    await visit('/projects/1');
    await click('.milestone-header');

    assert.equal(find('[data-test-milestone-dates="1"').textContent.trim(), 'January 1, 2001');
  });

  test('eas prefer correct date for projects beginning withOUT P', async function(assert) {
    this.server.create('project', {
      dcpName: '1234',
      milestones: [
        this.server.create('milestone', 'isCompleted', 'filedEasReview', {
          id: 1,
          dcpActualstartdate: '9/9/9',
        }),
        this.server.create('milestone', 'isCompleted', {
          dcpMilestone: '723beec4-dad0-e711-8116-1458d04e2fb8', // prepared eas
          dcpActualenddate: '1/1/1',
        }),
      ],
    });
    await visit('/projects/1');
    await click('.milestone-header');

    assert.equal(find('[data-test-milestone-dates="1"').textContent.trim(), 'September 9, 2009');
  });
});
