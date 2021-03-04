import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

module('Integration | Component | archive-project-milestone-list-item', function(hooks) {
  setupRenderingTest(hooks);

  test('it displays a Community Board recommendation date', async function(assert) {
    this.set('project', {
      dispositions: [],
    });

    this.set(
      'milestone',
      EmberObject.create({
        displayName: 'Community Board Review',
        dcpMilestonesequence: 48,
        milestonename: 'Community Board Review',
        dcpMilestone: '923beec4-dad0-e711-8116-1458d04e2fb8',
        milestoneLinks: [],
        outcome: null,
        statuscode: 'Completed',
        dcpActualenddate: new Date('2020-12-15T00:00:00'),
        dcpActualstartdate: null,
        dcpPlannedcompletiondate: null,
        dcpPlannedstartdate: '2019-10-05T20:31:57.956Z',
        id: '12',
      }),
    );

    await render(hbs`<ArchiveProjectMilestoneListItem @project={{this.project}} @milestone={{this.milestone}}/>`);

    assert.ok(this.element.textContent.includes('Community Board Review'));
    assert.ok(this.element.textContent.includes('12/15/2020'));
  });
});
