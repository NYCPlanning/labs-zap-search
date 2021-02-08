import { module, test } from 'qunit';
import {
  visit,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession, authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | archive project card renders', function(hooks) {
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

  test('archive project card displays recommendation dcpActualenddate', async function(assert) {
    this.server.create('user', {
      id: 1,
      email: 'qnbb@planning.nyc.gov',
      landUseParticipant: 'QNBB',
      assignments: [
        this.server.create('assignment', {
          id: 1,
          tab: 'archive',
          dcpLupteammemberrole: 'BB',
          project: server.create('project', {
            dispositions: [
              server.create('disposition', {
                id: 1,
                dcpPublichearinglocation: '121 Bananas Ave',
                dcpDateofpublichearing: new Date('2020-10-21T09:30:00'),
                dcpDatereceived: new Date('2020-12-15T00:00:00'),
                action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
                dcpDateofvote: new Date('2020-11-12T00:00:00'),
                dcpBoroughboardrecommendation: '717170002',
                dcpVotingagainstrecommendation: 1,
                dcpVotinginfavorrecommendation: 2,
                dcpVotingabstainingonrecommendation: 3,
                fullname: 'QN BB',
              }),
              server.create('disposition', {
                id: 2,
                dcpPublichearinglocation: '445 Peach St',
                dcpDateofpublichearing: new Date('2020-11-21T08:45:00'),
                dcpDatereceived: new Date('2020-12-20T00:00:00'),
                action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
                dcpDateofvote: new Date('2020-11-30T00:00:00'),
                dcpCommunityboardrecommendation: '717170002',
                dcpVotingagainstrecommendation: 1,
                dcpVotinginfavorrecommendation: 2,
                dcpVotingabstainingonrecommendation: 3,
                fullname: 'QN CB5',
              }),
            ],
            milestones: [
              server.create('milestone', {
                displayName: 'Community Board Review',
                dcpMilestonesequence: 48,
                milestonename: 'Community Board Review',
                dcpMilestone: '923beec4-dad0-e711-8116-1458d04e2fb8',
                milestoneLinks: [],
                outcome: null,
                statuscode: 'Completed',
                dcpActualenddate: new Date('2020-10-23T01:30:00'),
                dcpActualstartdate: null,
                dcpPlannedcompletiondate: null,
                dcpPlannedstartdate: '2019-10-05T20:31:57.956Z',
                id: '12',
              }),
              server.create('milestone', {
                displayName: 'Borough Board Review',
                dcpMilestonesequence: 50,
                milestonename: 'Borough Board Review',
                dcpMilestone: '963beec4-dad0-e711-8116-1458d04e2fb8',
                milestoneLinks: [],
                outcome: null,
                statuscode: 'In Progress',
                dcpActualenddate: new Date('2020-10-21T01:30:00'),
                dcpActualstartdate: '2019-10-07T19:31:58.519Z',
                dcpPlannedcompletiondate: null,
                dcpPlannedstartdate: null,
                id: '38',
              }),
            ],
          }),
        }),
      ],
    });

    await authenticateSession({
      id: 1,
    });

    await visit('/my-projects/archive');

    assert.ok(this.element.querySelector('[data-test-actual-end-date="38"]').textContent.includes('10/21/2020'), 'actual end date borough board');
    assert.ok(this.element.querySelector('[data-test-actual-end-date="12"]').textContent.includes('10/23/2020'), 'actual end date community board');
  });
});
