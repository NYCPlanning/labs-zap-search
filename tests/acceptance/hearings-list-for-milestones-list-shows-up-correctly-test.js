import { module, test } from 'qunit';
import {
  visit,
  find,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession, authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | hearings list for milestones list shows up correctly', function(hooks) {
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

  hooks.beforeEach(async function() {
    await authenticateSession();
  });

  test('hearings-list-for-milestones-list shows up on upcoming tab', async function(assert) {
    // ########## UPCOMING #################################################################
    this.server.create('assignment', {
      id: 5,
      tab: 'upcoming',
      dispositions: [
        server.create('disposition', {
          id: 17,
          dcpPublichearinglocation: 'Purple',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
        server.create('disposition', {
          id: 18,
          dcpPublichearinglocation: 'Purple',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        }),
      ],
      project: this.server.create('project', {
        dispositions: [
          server.create('disposition', {
            id: 17,
            dcpPublichearinglocation: 'Purple',
            dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
            action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 18,
            dcpPublichearinglocation: 'Purple',
            dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
            action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
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
            dcpActualenddate: null,
            dcpActualstartdate: '2019-07-13T19:31:57.763Z',
            dcpPlannedcompletiondate: null,
            dcpPlannedstartdate: null,
            id: '1',
          }),
          server.create('milestone', {
            displayName: 'Application Reviewed at City Planning Commission Review Session',
            dcpMilestonesequence: 46,
            milestonename: 'Application Reviewed at City Planning Commission Review Session',
            dcpMilestone: '8e3beec4-dad0-e711-8116-1458d04e2fb8',
            milestoneLinks: [],
            dcpMilestoneoutcome: null,
            displayDate2: null,
            displayDate: '2019-10-18T19:31:57.916Z',
            statuscode: 'Not Started',
            dcpActualenddate: null,
            dcpActualstartdate: '2019-10-18T19:31:57.916Z',
            dcpPlannedcompletiondate: null,
            dcpPlannedstartdate: null,
            id: '11',
          }),
          server.create('milestone', {
            displayName: 'Community Board Review',
            dcpMilestonesequence: 48,
            milestonename: 'Community Board Review',
            dcpMilestone: '923beec4-dad0-e711-8116-1458d04e2fb8',
            milestoneLinks: [],
            dcpMilestoneoutcome: null,
            displayDate2: null,
            displayDate: '2019-11-17T20:31:57.956Z',
            statuscode: 'Not Started',
            dcpActualenddate: null,
            dcpActualstartdate: null,
            dcpPlannedcompletiondate: null,
            dcpPlannedstartdate: '2019-11-17T20:31:57.956Z',
            id: '12',
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
            dcpPlannedcompletiondate: null,
            dcpPlannedstartdate: null,
            id: '38',
          }),
        ],
      }),
    });

    await visit('/my-projects/upcoming');

    assert.ok(this.element.querySelector('[data-test-hearing-title]').textContent.includes('Borough Board Public Hearing'));
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="0"]').textContent.includes('Zoning Special Permit'));
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="1"]').textContent.includes('Zoning Text Amendment'));
    assert.ok(this.element.querySelector('[data-test-hearing-location="17"]').textContent.includes('Purple'));
    assert.ok(this.element.querySelector('[data-test-hearing-date="17"]').textContent.includes('October 21'));
  });

  test('hearings-list-for-milestones-list shows up on reviewed tab', async function(assert) {
    // ########## Reviewed #################################################################
    this.server.create('assignment', {
      id: 5,
      tab: 'reviewed',
      dispositions: [
        server.create('disposition', {
          id: 17,
          dcpPublichearinglocation: 'Purple',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
        server.create('disposition', {
          id: 18,
          dcpPublichearinglocation: 'Purple',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        }),
      ],
      project: this.server.create('project', {
        dispositions: [
          server.create('disposition', {
            id: 17,
            dcpPublichearinglocation: 'Purple',
            dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
            action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 18,
            dcpPublichearinglocation: 'Purple',
            dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
            action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
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
            dcpActualenddate: null,
            dcpActualstartdate: '2019-07-13T19:31:57.763Z',
            dcpPlannedcompletiondate: null,
            dcpPlannedstartdate: null,
            id: '1',
          }),
          server.create('milestone', {
            displayName: 'Application Reviewed at City Planning Commission Review Session',
            dcpMilestonesequence: 46,
            milestonename: 'Application Reviewed at City Planning Commission Review Session',
            dcpMilestone: '8e3beec4-dad0-e711-8116-1458d04e2fb8',
            milestoneLinks: [],
            dcpMilestoneoutcome: null,
            displayDate2: null,
            displayDate: '2019-10-18T19:31:57.916Z',
            statuscode: 'Not Started',
            dcpActualenddate: null,
            dcpActualstartdate: '2019-10-18T19:31:57.916Z',
            dcpPlannedcompletiondate: null,
            dcpPlannedstartdate: null,
            id: '11',
          }),
          server.create('milestone', {
            displayName: 'Community Board Review',
            dcpMilestonesequence: 48,
            milestonename: 'Community Board Review',
            dcpMilestone: '923beec4-dad0-e711-8116-1458d04e2fb8',
            milestoneLinks: [],
            dcpMilestoneoutcome: null,
            displayDate2: null,
            displayDate: '2019-11-17T20:31:57.956Z',
            statuscode: 'Not Started',
            dcpActualenddate: null,
            dcpActualstartdate: null,
            dcpPlannedcompletiondate: null,
            dcpPlannedstartdate: '2019-11-17T20:31:57.956Z',
            id: '12',
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
            dcpPlannedcompletiondate: null,
            dcpPlannedstartdate: null,
            id: '38',
          }),
        ],
      }),
    });

    await visit('/my-projects/reviewed');

    assert.ok(this.element.querySelector('[data-test-hearing-title]').textContent.includes('Borough Board Public Hearing'));
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="0"]').textContent.includes('Zoning Special Permit'));
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="1"]').textContent.includes('Zoning Text Amendment'));
    assert.ok(this.element.querySelector('[data-test-hearing-location="17"]').textContent.includes('Purple'));
    assert.ok(this.element.querySelector('[data-test-hearing-date="17"]').textContent.includes('October 21'));
  });

  test('hearings-list-for-milestones-list shows up on archive tab', async function(assert) {
    // ########## Archive #################################################################
    this.server.create('assignment', {
      id: 5,
      tab: 'archive',
      dispositions: [
        server.create('disposition', {
          id: 17,
          dcpPublichearinglocation: 'Purple',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
        server.create('disposition', {
          id: 18,
          dcpPublichearinglocation: 'Purple',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        }),
      ],
      project: this.server.create('project', {
        dispositions: [
          server.create('disposition', {
            id: 17,
            dcpPublichearinglocation: 'Purple',
            dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
            action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 18,
            dcpPublichearinglocation: 'Purple',
            dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
            action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
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
            dcpActualenddate: null,
            dcpActualstartdate: '2019-07-13T19:31:57.763Z',
            dcpPlannedcompletiondate: null,
            dcpPlannedstartdate: null,
            id: '1',
          }),
          server.create('milestone', {
            displayName: 'Application Reviewed at City Planning Commission Review Session',
            dcpMilestonesequence: 46,
            milestonename: 'Application Reviewed at City Planning Commission Review Session',
            dcpMilestone: '8e3beec4-dad0-e711-8116-1458d04e2fb8',
            milestoneLinks: [],
            dcpMilestoneoutcome: null,
            displayDate2: null,
            displayDate: '2019-10-18T19:31:57.916Z',
            statuscode: 'Not Started',
            dcpActualenddate: null,
            dcpActualstartdate: '2019-10-18T19:31:57.916Z',
            dcpPlannedcompletiondate: null,
            dcpPlannedstartdate: null,
            id: '11',
          }),
          server.create('milestone', {
            displayName: 'Community Board Review',
            dcpMilestonesequence: 48,
            milestonename: 'Community Board Review',
            dcpMilestone: '923beec4-dad0-e711-8116-1458d04e2fb8',
            milestoneLinks: [],
            dcpMilestoneoutcome: null,
            displayDate2: null,
            displayDate: '2019-11-17T20:31:57.956Z',
            statuscode: 'Not Started',
            dcpActualenddate: null,
            dcpActualstartdate: null,
            dcpPlannedcompletiondate: null,
            dcpPlannedstartdate: '2019-11-17T20:31:57.956Z',
            id: '12',
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
            dcpPlannedcompletiondate: null,
            dcpPlannedstartdate: null,
            id: '38',
          }),
        ],
      }),
    });

    await visit('/my-projects/archive');

    assert.ok(this.element.querySelector('[data-test-hearing-title]').textContent.includes('Borough Board Public Hearing'));
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="0"]').textContent.includes('Zoning Special Permit'));
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="1"]').textContent.includes('Zoning Text Amendment'));
    assert.ok(this.element.querySelector('[data-test-hearing-location="17"]').textContent.includes('Purple'));
    assert.ok(this.element.querySelector('[data-test-hearing-date="17"]').textContent.includes('October 21'));
  });

  test('hearings-list-for-milestones-list does not show up if dcpActualenddate is in past', async function(assert) {
    // ########## Archive #################################################################
    this.server.create('assignment', {
      id: 5,
      tab: 'reviewed',
      dispositions: [
        server.create('disposition', {
          id: 17,
          dcpPublichearinglocation: 'Purple',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
        server.create('disposition', {
          id: 18,
          dcpPublichearinglocation: 'Purple',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        }),
      ],
      project: this.server.create('project', {
        dispositions: [
          server.create('disposition', {
            id: 17,
            dcpPublichearinglocation: 'Purple',
            dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
            action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 18,
            dcpPublichearinglocation: 'Purple',
            dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
            action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
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
            dcpActualenddate: null,
            dcpActualstartdate: '2019-07-13T19:31:57.763Z',
            dcpPlannedcompletiondate: null,
            dcpPlannedstartdate: null,
            id: '1',
          }),
          server.create('milestone', {
            displayName: 'Application Reviewed at City Planning Commission Review Session',
            dcpMilestonesequence: 46,
            milestonename: 'Application Reviewed at City Planning Commission Review Session',
            dcpMilestone: '8e3beec4-dad0-e711-8116-1458d04e2fb8',
            milestoneLinks: [],
            dcpMilestoneoutcome: null,
            displayDate2: null,
            displayDate: '2019-10-18T19:31:57.916Z',
            statuscode: 'Not Started',
            dcpActualenddate: null,
            dcpActualstartdate: '2019-10-18T19:31:57.916Z',
            dcpPlannedcompletiondate: null,
            dcpPlannedstartdate: null,
            id: '11',
          }),
          server.create('milestone', {
            displayName: 'Community Board Review',
            dcpMilestonesequence: 48,
            milestonename: 'Community Board Review',
            dcpMilestone: '923beec4-dad0-e711-8116-1458d04e2fb8',
            milestoneLinks: [],
            dcpMilestoneoutcome: null,
            displayDate2: null,
            displayDate: '2019-11-17T20:31:57.956Z',
            statuscode: 'Not Started',
            dcpActualenddate: null,
            dcpActualstartdate: null,
            dcpPlannedcompletiondate: null,
            dcpPlannedstartdate: '2019-11-17T20:31:57.956Z',
            id: '12',
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
            statuscode: 'Approved',
            dcpActualenddate: '2018-11-06T20:31:58.519Z',
            dcpActualstartdate: '2019-10-07T19:31:58.519Z',
            dcpPlannedcompletiondate: null,
            dcpPlannedstartdate: null,
            id: '38',
          }),
        ],
      }),
    });

    await visit('/my-projects/reviewed');

    assert.notOk(find('[data-test-hearing-title]'));
    assert.notOk(find('[data-test-hearing-actions-list="0"]'));
    assert.notOk(find('[data-test-hearing-actions-list="1"]'));
    assert.notOk(find('[data-test-hearing-location="17"]'));
    assert.notOk(find('[data-test-hearing-date="17"]'));
  });
});
