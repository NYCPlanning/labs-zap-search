import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

module('Integration | Component | reviewed-project-milestone-list-item', function(hooks) {
  setupRenderingTest(hooks);

  test('it does not display "Recommendation Submitted" when there are no dispos', async function(assert) {
    this.set('project', { dispositions: [] });

    this.set('milestone', {});

    await render(hbs`<ArchiveProjectMilestoneListItem @project={{this.project}} @milestone={{this.milestone}}/>`);

    assert.notOk(find('[data-test-cb-disposition-date-received]'));
  });


  test('it does not display "Recommendation Submitted" date when there is no recommendation', async function(assert) {
    this.set(
      'project',
      {
        dispositions: [
          EmberObject.create({
            dcpCommunityboardrecommendation: '',
            dcpDatereceived: null,
          }),
        ],
      },
    );

    this.set('milestone', {});

    await render(hbs`<ArchiveProjectMilestoneListItem @project={{this.project}} @milestone={{this.milestone}}/>`);

    assert.notOk(find('[data-test-cb-disposition-date-received]'));
  });


  test('it does not display "Recommendation Submitted" date when there is a recommendation but there is no date received', async function(assert) {
    this.set(
      'project',
      {
        dispositions: [
          EmberObject.create({
            dcpCommunityboardrecommendation: 'foo',
            dcpDatereceived: null,
          }),
        ],
      },
    );

    this.set('milestone', {});

    await render(hbs`<ArchiveProjectMilestoneListItem @project={{this.project}} @milestone={{this.milestone}}/>`);

    assert.notOk(find('[data-test-cb-disposition-date-received]'));
  });


  test('it displays a Community Board recommendation date', async function(assert) {
    this.set('project', {
      dispositions: [
        EmberObject.create({
          dcpCommunityboardrecommendation: 'foo',
          dcpDatereceived: new Date(),
        }),
      ],
    });

    this.set(
      'milestone',
      EmberObject.create({
        displayName: 'Community Board Review',
        dcpMilestonesequence: 48,
        milestonename: 'Community Board Review',
        dcpMilestone: '923beec4-dad0-e711-8116-1458d04e2fb8',
        milestoneLinks: [],
        dcpMilestoneoutcome: null,
        displayDate2: null,
        displayDate: '2019-10-05T20:31:57.956Z',
        statuscode: 'Completed',
        dcpActualenddate: null,
        dcpActualstartdate: null,
        dcpPlannedcompletiondate: null,
        dcpPlannedstartdate: '2019-10-05T20:31:57.956Z',
        id: '12',
      }),
    );

    await render(hbs`<ArchiveProjectMilestoneListItem @project={{this.project}} @milestone={{this.milestone}}/>`);

    assert.ok(find('[data-test-cb-disposition-date-received]'));
  });
});
