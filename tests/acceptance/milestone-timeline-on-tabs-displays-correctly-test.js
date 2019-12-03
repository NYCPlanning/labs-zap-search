import { module, test } from 'qunit';
import {
  visit,
  find,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession, authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | milestone timeline on tabs displays correctly', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    window.location.hash = '';

    await invalidateSession();
    await authenticateSession({
      id: 1,
    });
  });

  hooks.afterEach(async function() {
    window.location.hash = '';

    await invalidateSession();
  });

  test('milestones list on UPCOMING tab shows up in correct order', async function(assert) {
    // ########## UPCOMING #################################################################
    this.server.create('assignment', {
      id: 5,
      tab: 'upcoming',
      user: server.create('user', {
        name: 'Peter Pan',
        landUseParticipant: 'QNBB',
      }),
      project: this.server.create('project', {
        dispositions: [
          server.create('disposition', {
            id: 17,
            dcpPublichearinglocation: '121 Bananas Avenue, Queens',
            dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
            fullname: 'QN BB',
            action: server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
        ],
        milestones: [
          server.create('milestone', {
            displayName: 'Land Use Application Filed',
            dcpMilestonesequence: 26,
            milestonename: 'Land Use Application Filed',
            dcpMilestone: '663beec4-dad0-e711-8116-1458d04e2fb8',
            dcpMilestoneoutcome: null,
            displayDate2: null,
            displayDate: '2019-07-13T19:31:57.763Z',
            statuscode: 'Completed',
            dcpActualenddate: '2019-08-28T19:31:57.781Z',
            dcpActualstartdate: '2019-07-13T19:31:57.763Z',
            dcpPlannedcompletiondate: '2019-08-28T19:31:57.781Z',
            dcpPlannedstartdate: null,
            id: '1',
          }),
          server.create('milestone', {
            displayName: 'Land Use Fee Paid',
            dcpMilestonesequence: 28,
            milestonename: 'Land Use Fee Paid',
            dcpMilestone: '6a3beec4-dad0-e711-8116-1458d04e2fb8',
            milestoneLinks: [],
            dcpMilestoneoutcome: null,
            displayDate2: null,
            displayDate: '2019-07-18T19:31:57.772Z',
            statuscode: 'Completed',
            dcpActualenddate: '2019-08-28T19:31:57.781Z',
            dcpActualstartdate: '2019-07-18T19:31:57.772Z',
            dcpPlannedcompletiondate: '2019-08-28T19:31:57.781Z',
            dcpPlannedstartdate: null,
            id: '2',
          }),
          server.create('milestone', {
            displayName: 'CEQR Fee Paid',
            dcpMilestonesequence: 36,
            milestonename: 'CEQR Fee Paid',
            dcpMilestone: '763beec4-dad0-e711-8116-1458d04e2fb8',
            milestoneLinks: [],
            dcpMilestoneoutcome: null,
            displayDate2: null,
            displayDate: '2019-08-07T19:31:57.789Z',
            statuscode: 'Completed',
            dcpActualenddate: '2019-08-19T19:31:57.781Z',
            dcpActualstartdate: '2019-08-07T19:31:57.789Z',
            dcpPlannedcompletiondate: '2019-08-28T19:31:57.781Z',
            dcpPlannedstartdate: null,
            id: '4',
          }),
          server.create('milestone', {
            displayName: 'Final Scope of Work for Environmental Impact Statement Issued',
            dcpMilestonesequence: 40,
            milestonename: 'Final Scope of Work for Environmental Impact Statement Issued',
            dcpMilestone: '823beec4-dad0-e711-8116-1458d04e2fb8',
            milestoneLinks: [],
            dcpMilestoneoutcome: null,
            displayDate2: null,
            displayDate: '2019-09-16T19:31:57.831Z',
            statuscode: 'Completed',
            dcpActualenddate: '2019-08-22T19:31:57.781Z',
            dcpActualstartdate: '2019-09-16T19:31:57.831Z',
            dcpPlannedcompletiondate: '2019-08-28T19:31:57.781Z',
            dcpPlannedstartdate: null,
            id: '7',
          }),
          server.create('milestone', {
            displayName: 'Application Reviewed at City Planning Commission Review Session',
            dcpMilestonesequence: 46,
            milestonename: 'Application Reviewed at City Planning Commission Review Session',
            dcpMilestone: '8e3beec4-dad0-e711-8116-1458d04e2fb8',
            milestoneLinks: [],
            dcpMilestoneoutcome: null,
            displayDate2: '2019-09-06T19:31:58.463Z',
            displayDate: '2019-09-01T19:31:58.463Z',
            statuscode: 'Completed',
            dcpActualenddate: '2019-09-06T19:31:58.463Z',
            dcpActualstartdate: '2019-09-01T19:31:58.463Z',
            dcpPlannedcompletiondate: '2019-08-28T19:31:57.781Z',
            dcpPlannedstartdate: null,
            id: '33',
          }),
          server.create('milestone', {
            displayName: 'Community Board Review',
            dcpMilestonesequence: 48,
            milestonename: 'Community Board Review',
            dcpMilestone: '923beec4-dad0-e711-8116-1458d04e2fb8',
            milestoneLinks: [],
            dcpMilestoneoutcome: null,
            displayDate2: '2019-11-05T20:31:58.472Z',
            displayDate: '2019-09-06T19:31:58.472Z',
            statuscode: 'Completed',
            dcpActualenddate: '2019-11-05T20:31:58.472Z',
            dcpActualstartdate: '2019-09-06T19:31:58.472Z',
            dcpPlannedcompletiondate: '2019-08-28T19:31:57.781Z',
            dcpPlannedstartdate: null,
            id: '34',
          }),
          server.create('milestone', {
            displayName: 'Borough President Review',
            dcpMilestonesequence: 49,
            milestonename: 'Borough President Review',
            dcpMilestone: '943beec4-dad0-e711-8116-1458d04e2fb8',
            milestoneLinks: [],
            dcpMilestoneoutcome: null,
            displayDate2: '2019-11-06T20:31:58.508Z',
            displayDate: '2019-10-07T19:31:58.508Z',
            statuscode: 'Completed',
            dcpActualenddate: '2019-11-06T20:31:58.508Z',
            dcpActualstartdate: '2019-10-07T19:31:58.507Z',
            dcpPlannedcompletiondate: '2019-08-28T19:31:57.781Z',
            dcpPlannedstartdate: null,
            id: '37',
          }),
          server.create('milestone', {
            displayName: 'Borough Board Review',
            dcpMilestonesequence: 50,
            milestonename: 'Borough Board Review',
            dcpMilestone: '963beec4-dad0-e711-8116-1458d04e2fb8',
            milestoneLinks: [],
            dcpMilestoneoutcome: null,
            displayDate2: '2019-11-06T20:31:58.519Z',
            displayDate: '2019-10-07T19:31:58.519Z',
            statuscode: 'In Progress',
            dcpActualenddate: '2019-11-06T20:31:58.519Z',
            dcpActualstartdate: '2019-10-07T19:31:58.519Z',
            dcpPlannedcompletiondate: '2019-08-28T19:31:57.781Z',
            dcpPlannedstartdate: null,
            id: '38',
          }),
          server.create('milestone', {
            displayName: 'City Planning Commission Review',
            dcpMilestonesequence: 54,
            milestonename: 'City Planning Commission Review',
            dcpMilestone: '9e3beec4-dad0-e711-8116-1458d04e2fb8',
            milestoneLinks: [],
            dcpMilestoneoutcome: null,
            displayDate2: '2019-12-07T20:31:58.530Z',
            displayDate: '2019-11-07T20:31:58.530Z',
            statuscode: 'Not Started',
            dcpActualenddate: '2019-12-07T20:31:58.530Z',
            dcpActualstartdate: '2019-11-07T20:31:58.530Z',
            dcpPlannedcompletiondate: '2019-08-28T19:31:57.781Z',
            dcpPlannedstartdate: null,
            id: '39',
          }),
        ],
      }),
    });

    await visit('/my-projects/upcoming');

    assert.ok(this.element.querySelector('[data-test-milestone-displayname="0"]').textContent.includes('Land Use Application Filed'));
    assert.ok(this.element.querySelector('[data-test-milestone-displayname="1"]').textContent.includes('Application Reviewed at City Planning Commission Review Session'));
    assert.ok(this.element.querySelector('[data-test-milestone-displayname="2"]').textContent.includes('Community Board Review'));
    assert.ok(this.element.querySelector('[data-test-milestone-displayname="3"]').textContent.includes('Borough President Review'));
    assert.ok(this.element.querySelector('[data-test-milestone-displayname="4"]').textContent.includes('Borough Board Review'));
    assert.notOk(find('[data-test-milestone-displayname="5"]'));
  });
});
