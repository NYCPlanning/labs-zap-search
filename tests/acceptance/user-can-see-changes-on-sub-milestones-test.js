import { module, test } from 'qunit';
import {
  visit,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession } from 'ember-simple-auth/test-support';

module('Acceptance | user can see changes on sub-milestones', function(hooks) {
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

  test('user can go through whole process', async function(assert) {
    server.createList('project', 10);

    // dates for dcpDateofpublichearing
    const date_A = new Date('2020-10-21T00:00:00');
    const date_B = new Date('2020-02-12T00:00:00');
    const date_C = new Date('2020-11-12T00:00:00');
    const date_D = new Date('2020-03-12T00:00:00');

    this.server.create('project', {
      id: 1,
      tab: 'to-review',
      dcpName: 'P2012M046',
      users: [
        server.create('user', {
          id: 1,
          emailaddress1: 'testuser1@planning.nyc.gov',
          landUseParticipant: 'QNCB5',
        }),
        server.create('user', {
          id: 2,
          emailaddress1: 'testuser2@planning.nyc.gov',
          landUseParticipant: 'QNBP',
        }),
      ],
      actions: [
        server.create('action', {
          id: 1,
          dcpName: 'Zoning Text Amendment',
          dcpUlurpnumber: 'N860877TCM',
        }),
        server.create('action', {
          id: 2,
          dcpName: 'Zoning Special Permit',
          dcpUlurpnumber: 'C780076TLK',
        }),
      ],
      milestones: [
        server.create('milestone', {
          id: 1,
          dcpMilestonesequence: 50,
          displayName: 'Community Board Review',
          displayDate: '2019-04-11T22:35:09.161Z',
        }),
        server.create('milestone', {
          id: 2,
          dcpMilestonesequence: 49,
          displayName: 'Borough President Review',
          displayDate: '2019-06-11T22:35:09.161Z',
        }),
      ],
      dispositions: [
        server.create('disposition', {
          id: 1,
          dcpPublichearinglocation: '701 Bananas Road',
          dcpDateofpublichearing: date_A,
          user: server.create('user', {
            landUseParticipant: 'QNCB5',
          }),
          action: server.create('action', {
            dcpName: 'Zoning Special Permit',
            dcpUlurpnumber: 'C780076TLK',
          }),
          dcpDateofvote: date_A,
          dcpVotingagainstrecommendation: 5,
          dcpVotinginfavorrecommendation: 10,
          dcpVotingabstainingonrecommendation: 4,
          dcpCommunityboardrecommendation: 'Approved',
        }),
        server.create('disposition', {
          id: 2,
          dcpPublichearinglocation: '900 Eggplant Boulevard',
          dcpDateofpublichearing: date_B,
          user: server.create('user', {
            landUseParticipant: 'QNCB5',
          }),
          action: server.create('action', {
            dcpName: 'Zoning Text Amendment',
            dcpUlurpnumber: 'N860877TCM',
          }),
          dcpDateofvote: date_C,
          dcpVotingagainstrecommendation: 4,
          dcpVotinginfavorrecommendation: 5,
          dcpVotingabstainingonrecommendation: 6,
          dcpCommunityboardrecommendation: 'Disapproved',
        }),
        server.create('disposition', {
          id: 3,
          dcpPublichearinglocation: '783 Peach St',
          dcpDateofpublichearing: date_C,
          user: server.create('user', {
            landUseParticipant: 'QNBP',
          }),
          action: server.create('action', {
            dcpName: 'Zoning Special Permit',
            dcpUlurpnumber: 'C780076TLK',
          }),
          dcpDateofvote: date_A,
          dcpVotingagainstrecommendation: 3,
          dcpVotinginfavorrecommendation: 7,
          dcpVotingabstainingonrecommendation: 1,
          dcpCommunityboardrecommendation: 'Approved',
        }),
        server.create('disposition', {
          id: 4,
          dcpPublichearinglocation: '345 Starfruit Ave',
          dcpDateofpublichearing: date_D,
          user: server.create('user', {
            landUseParticipant: 'QNBP',
          }),
          action: server.create('action', {
            dcpName: 'Zoning Text Amendment',
            dcpUlurpnumber: 'N860877TCM',
          }),
          dcpDateofvote: date_A,
          dcpVotingagainstrecommendation: 1,
          dcpVotinginfavorrecommendation: 2,
          dcpVotingabstainingonrecommendation: 3,
          dcpCommunityboardrecommendation: 'Disapproved',
        }),
      ],
    });

    await visit('/projects/1');

    assert.ok(this.element.textContent.includes('VOTE'));
  });
});
