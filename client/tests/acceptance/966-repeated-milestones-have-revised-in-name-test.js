import { module, test } from 'qunit';
import {
  visit,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession, authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | 966 repeated milestones have revised in name', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    window.location.hash = '';

    await invalidateSession();
    await authenticateSession({
      access_token: 'test',
    });

    this.server.create('user');
  });

  hooks.afterEach(async function() {
    window.location.hash = '';

    await invalidateSession();
  });

  test('repeated milestones AFTER the first in the list with the same name will have `Revised` in the name', async function(assert) {
    this.server.create('project', {
      // NOTE: These five `Land Use Application Filed` milestones are based on real data for project P2015K0272
      // to search these milestones by id run the SQL query
      // Example: SELECT * FROM dcp_projectmilestone WHERE dcp_projectmilestoneid = '2e710c18-643e-e811-812a-1458d04d2538'
      milestones: [
        // MILESTONE 2e710c18-643e-e811-812a-1458d04d2538
        server.create('milestone', {
          id: '2e710c18-643e-e811-812a-1458d04d2538',
          displayName: 'Land Use Application Filed',
          dcpName: 'EIS - Prepare Filed Land Use Application  ',
          dcpActualenddate: '2019-02-19T21:49:26',
          dcpActualstartdate: '2019-02-19T21:49:20',
          dcpMilestone: '663beec4-dad0-e711-8116-1458d04e2fb8',
          dcpMilestonesequence: '26',
          dcpPlannedcompletiondate: '2019-04-09T05:00:00',
          dcpPlannedstartdate: '2019-02-13T05:00:00',
          milestonename: 'Prepare Filed Land Use Application',
          statuscode: 'Completed',
        }),
        // MILESTONE 4bd1cdb2-ac3e-e911-814c-1458d04d2538
        server.create('milestone', {
          id: '4bd1cdb2-ac3e-e911-814c-1458d04d2538',
          displayName: 'Land Use Application Filed',
          dcpName: 'Ad-hoc - Prepare Filed Land Use Application',
          dcpActualenddate: '2019-03-04T18:38:59',
          dcpActualstartdate: '2019-03-04T18:38:44',
          dcpMilestone: '663beec4-dad0-e711-8116-1458d04e2fb8',
          dcpMilestonesequence: '26',
          dcpPlannedcompletiondate: '2019-03-30T04:00:00',
          dcpPlannedstartdate: '2019-03-29T04:00:00',
          milestonename: 'Prepare Filed Land Use Application',
          statuscode: 'Completed',
        }),
        // MILESTONE fb095583-94bf-e911-a997-001dd830809a
        server.create('milestone', {
          id: 'fb095583-94bf-e911-a997-001dd830809a',
          displayName: 'Land Use Application Filed',
          dcpName: 'Ad-hoc - Prepare Filed Land Use Application',
          dcpActualenddate: '2019-08-30T15:10:12',
          dcpActualstartdate: '2019-08-10T04:00:00',
          dcpMilestone: '663beec4-dad0-e711-8116-1458d04e2fb8',
          dcpMilestonesequence: '26',
          dcpPlannedcompletiondate: '2019-09-21T20:52:00',
          dcpPlannedstartdate: '2019-02-13T05:00:00',
          milestonename: 'Prepare Filed Land Use Application',
          statuscode: 'Completed',
        }),
        // MILESTONE 8f395fb1-50d6-e911-a9a1-001dd8308d01
        server.create('milestone', {
          id: '8f395fb1-50d6-e911-a9a1-001dd8308d01',
          displayName: 'Land Use Application Filed',
          dcpName: 'Ad-hoc - Prepare Filed Land Use Application',
          dcpActualenddate: '2019-09-13T18:05:49',
          dcpActualstartdate: '2019-09-11T04:00:00',
          dcpMilestone: '663beec4-dad0-e711-8116-1458d04e2fb8',
          dcpMilestonesequence: '26',
          dcpPlannedcompletiondate: '2019-09-16T04:00:00',
          dcpPlannedstartdate: '2019-09-11T04:00:00',
          milestonename: 'Prepare Filed Land Use Application',
          statuscode: 'Completed',
        }),
        // MILESTONE 3b93bede-a9fc-e911-a9b0-001dd8308d01
        server.create('milestone', {
          id: '3b93bede-a9fc-e911-a9b0-001dd8308d01',
          displayName: 'Land Use Application Filed',
          dcpName: 'EIS - Prepare Filed Land Use Application  ',
          dcpActualenddate: null,
          dcpActualstartdate: null,
          dcpMilestone: '663beec4-dad0-e711-8116-1458d04e2fb8',
          dcpMilestonesequence: '26',
          dcpPlannedcompletiondate: null,
          dcpPlannedstartdate: null,
          milestonename: 'Prepare Filed Land Use Application',
          statuscode: 'Not Started',
        }),
        // Application Reviewed at City Planning Commission Review Session MILESTONE
        server.create('milestone', {
          displayName: 'Application Reviewed at City Planning Commission Review Session',
          dcpMilestonesequence: 46,
          milestonename: 'Application Reviewed at City Planning Commission Review Session',
          dcpMilestone: '8e3beec4-dad0-e711-8116-1458d04e2fb8',
          milestoneLinks: [],
          outcome: null,
          statuscode: 'Completed',
          dcpActualenddate: null,
          dcpActualstartdate: '2019-10-18T19:31:57.916Z',
          dcpPlannedcompletiondate: null,
          dcpPlannedstartdate: null,
          id: '1',
        }),
        // Community Board Review MILESTONE
        server.create('milestone', {
          displayName: 'Community Board Review',
          dcpMilestonesequence: 48,
          milestonename: 'Community Board Review',
          dcpMilestone: '923beec4-dad0-e711-8116-1458d04e2fb8',
          milestoneLinks: [],
          outcome: null,
          statuscode: 'Completed',
          dcpActualenddate: null,
          dcpActualstartdate: null,
          dcpPlannedcompletiondate: null,
          dcpPlannedstartdate: '2019-10-05T20:31:57.956Z',
          id: '2',
        }),
        // Borough Board Review MILESTONE
        server.create('milestone', {
          displayName: 'Borough Board Review',
          dcpMilestonesequence: 50,
          milestonename: 'Borough Board Review',
          dcpMilestone: '963beec4-dad0-e711-8116-1458d04e2fb8',
          milestoneLinks: [],
          outcome: null,
          statuscode: 'In Progress',
          dcpActualenddate: '2019-11-06T20:31:58.519Z',
          dcpActualstartdate: '2019-10-07T19:31:58.519Z',
          dcpPlannedcompletiondate: null,
          dcpPlannedstartdate: null,
          id: '3',
        }),
      ],
    });

    await visit('/projects/1');

    assert.notOk(this.element.querySelector('[data-test-milestone-name="2e710c18-643e-e811-812a-1458d04d2538"]').textContent.includes('Revised'), 'first land use app milestone');
    assert.ok(this.element.querySelector('[data-test-milestone-name="4bd1cdb2-ac3e-e911-814c-1458d04d2538"]').textContent.includes('Revised Land Use Application Filed'), 'second land use app milestone');
    assert.ok(this.element.querySelector('[data-test-milestone-name="fb095583-94bf-e911-a997-001dd830809a"]').textContent.includes('Revised Land Use Application Filed'), 'third land use app milestone');
    assert.ok(this.element.querySelector('[data-test-milestone-name="8f395fb1-50d6-e911-a9a1-001dd8308d01"]').textContent.includes('Revised Land Use Application Filed'), 'fourth land use app milestone');
    assert.ok(this.element.querySelector('[data-test-milestone-name="3b93bede-a9fc-e911-a9b0-001dd8308d01"]').textContent.includes('Revised Land Use Application Filed'), 'fifth land use app milestone');

    assert.notOk(this.element.querySelector('[data-test-milestone-name="1"]').textContent.includes('Revised'), 'only CPC milestone');
    assert.notOk(this.element.querySelector('[data-test-milestone-name="2"]').textContent.includes('Revised'), 'only CB milestone');
    assert.notOk(this.element.querySelector('[data-test-milestone-name="3"]').textContent.includes('Revised'), 'only BB milestone');
  });
});
