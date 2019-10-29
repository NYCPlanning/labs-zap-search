import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

module('Integration | Component | project-milestone', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    const ourModel = EmberObject.extend({});

    const milestone = ourModel.create({
      orderSensitiveName: 'Community Board Review',
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
      projectId: 1,
      project: ourModel.create({
        id: 1,
        dispositions: [
          ourModel.create({
            id: 18,
            dcpPublichearinglocation: '345 Purple Street, Manhattan',
            dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
            dcpRecommendationsubmittedbyname: 'QNCB2',
            action: ourModel.create({ id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
            dcpDateofvote: new Date('2020-11-12T01:30:00'),
            dcpBoroughboardrecommendation: 'Approved',
            dcpVotingagainstrecommendation: 2,
            dcpVotinginfavorrecommendation: 3,
            dcpVotingabstainingonrecommendation: 4,
          }),
        ],
      }),
    });

    this.set('milestone', milestone);

    await render(hbs`{{project-milestone milestone=this.milestone}}`);

    assert.ok(this.element.textContent.includes('Community Board Review'));
  });
});
