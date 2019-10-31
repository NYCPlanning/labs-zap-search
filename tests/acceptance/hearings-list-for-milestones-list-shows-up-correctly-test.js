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
    await authenticateSession({
      id: 1,
    });
  });

  hooks.afterEach(async function() {
    window.location.hash = '';

    await invalidateSession();
  });

  test('hearings-list-for-milestones-list shows up on upcoming tab in complicated scenario', async function(assert) {
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
            dcpRecommendationsubmittedbyname: 'QNBB',
            action: server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 18,
            dcpPublichearinglocation: '345 Purple Street, Manhattan',
            dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
            dcpRecommendationsubmittedbyname: 'MNBB',
            action: server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 19,
            dcpPublichearinglocation: '567 Grapefruit Boulevard, Manhattan',
            dcpDateofpublichearing: new Date('2021-04-14T20:30:00'),
            dcpRecommendationsubmittedbyname: 'MNBB',
            action: server.create('action', { id: 3, dcpName: 'Change to City Map', dcpUlurpnumber: 'N19983dLUP' }),
          }),
          server.create('disposition', {
            id: 20,
            dcpPublichearinglocation: '908 Cherries Road, Queens',
            dcpDateofpublichearing: new Date('2019-04-14T20:30:00'),
            dcpRecommendationsubmittedbyname: 'QNCB4',
            action: server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          // #### duplicate of 22 ############################################################
          server.create('disposition', {
            id: 21,
            dcpPublichearinglocation: '239 Spaghetti Street, Queens',
            dcpDateofpublichearing: new Date('2021-06-21T14:30:00'),
            dcpRecommendationsubmittedbyname: 'QNCB5',
            action: server.create('action', { id: 3, dcpName: 'Change to City Map', dcpUlurpnumber: 'N19983dLUP' }),
          }),
          // #### duplicate of 21 ############################################################
          server.create('disposition', {
            id: 22,
            dcpPublichearinglocation: '239 Spaghetti Street, Queens',
            dcpDateofpublichearing: new Date('2021-06-21T14:30:00'),
            dcpRecommendationsubmittedbyname: 'QNCB5',
            action: server.create('action', { id: 4, dcpName: 'Business Improvement District', dcpUlurpnumber: 'C780076TLK' }),
          }),
          // #### shouldn't show up ############################################################
          server.create('disposition', {
            id: 23,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpRecommendationsubmittedbyname: 'BXCB2',
            action: server.create('action', { id: 4, dcpName: 'Business Improvement District', dcpUlurpnumber: 'C780076TLK' }),
          }),
          // #### hearings waived ############################################################
          server.create('disposition', {
            id: 24,
            dcpPublichearinglocation: 'waived',
            dcpDateofpublichearing: null,
            dcpRecommendationsubmittedbyname: 'BKCB3',
            action: server.create('action', { id: 4, dcpName: 'Business Improvement District', dcpUlurpnumber: 'C780076TLK' }),
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
            statuscode: 'Completed',
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
            displayDate: '2019-10-05T20:31:57.956Z',
            statuscode: 'Completed',
            dcpActualenddate: null,
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

    // #### HEARING TITLE ############################################################
    assert.ok(this.element.querySelector('[data-test-hearing-title="Queens Borough Board"]').textContent.includes('Queens Borough Board Public Hearing'), 'QNBB');
    assert.ok(this.element.querySelector('[data-test-hearing-title="Manhattan Borough Board"]').textContent.includes('Manhattan Borough Board Public Hearing'), 'MNBB');
    assert.ok(this.element.querySelector('[data-test-hearing-title="Queens Community Board 5"]').textContent.includes('Queens Community Board 5 Public Hearing'), 'QNCB5');
    assert.ok(this.element.querySelector('[data-test-hearing-title="Queens Community Board 4"]').textContent.includes('Queens Community Board 4 Public Hearing'), 'QNCB4');
    assert.notOk(find('[data-test-hearing-title="Brooklyn Community Board 3"]'), 'BKCB3');
    assert.notOk(find('[data-test-hearing-title="Bronx Community Board 2"]'), 'BXCB2');

    // #### HEARING LOCATION ############################################################
    assert.ok(this.element.querySelector('[data-test-hearing-location="17"]').textContent.includes('121 Bananas Avenue, Queens'), 'location 17');
    assert.ok(this.element.querySelector('[data-test-hearing-location="18"]').textContent.includes('345 Purple Street, Manhattan'), 'location 18');
    assert.ok(this.element.querySelector('[data-test-hearing-location="19"]').textContent.includes('567 Grapefruit Boulevard, Manhattan'), 'location 19');
    assert.ok(this.element.querySelector('[data-test-hearing-location="20"]').textContent.includes('908 Cherries Road, Queens'), 'location 20');
    assert.ok(this.element.querySelector('[data-test-hearing-location="21"]').textContent.includes('239 Spaghetti Street, Queens'), 'location 21');
    // duplicate
    assert.notOk(find('[data-test-hearing-location="22"]'), 'location 22');
    // not submitted yet
    assert.notOk(find('[data-test-hearing-location="23"]'), 'location 23');
    // waived
    assert.notOk(find('[data-test-hearing-location="24"]'), 'location 24');

    // #### HEARING DATE ############################################################
    assert.ok(this.element.querySelector('[data-test-hearing-date="17"]').textContent.includes('October 21'), 'date 17');
    assert.ok(this.element.querySelector('[data-test-hearing-date="18"]').textContent.includes('October 21'), 'date 18');
    assert.ok(this.element.querySelector('[data-test-hearing-date="19"]').textContent.includes('April 14'), 'date 19');
    assert.ok(this.element.querySelector('[data-test-hearing-date="20"]').textContent.includes('April 14'), 'date 20');
    assert.ok(this.element.querySelector('[data-test-hearing-date="21"]').textContent.includes('June 21'), 'date 21');
    // duplicate
    assert.notOk(find('[data-test-hearing-date="22"]'), 'date 22');
    // not submitted yet
    assert.notOk(find('[data-test-hearing-date="23"]'), 'date 23');
    // waived
    assert.notOk(find('[data-test-hearing-date="24"]'), 'date 24');


    // #### HEARING ACTIONS ############################################################
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="170"]').textContent.includes('Zoning Special Permit'), 'action 170');
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="180"]').textContent.includes('Zoning Special Permit'), 'action 180');
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="190"]').textContent.includes('Change to City Map'), 'action 190');
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="200"]').textContent.includes('Zoning Special Permit'), 'action 200');
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="210"]').textContent.includes('Change to City Map'), 'action 210');
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="211"]').textContent.includes('Business Improvement District'), 'action 211 duplicate');
    // duplicate
    assert.notOk(find('[data-test-hearing-actions-list="220"]'), 'action 220');
    // not submitted yet
    assert.notOk(find('[data-test-hearing-actions-list="230"]'), 'action 230');
    // waived
    assert.notOk(find('[data-test-hearing-actions-list="240"]'), 'action 240');
  });

  test('hearings-list-for-milestones-list shows up correctly on show-project', async function(assert) {
    // ########## UPCOMING #################################################################
    this.server.create('project', {
      id: 5,
      dispositions: [
        server.create('disposition', {
          id: 17,
          dcpPublichearinglocation: '121 Bananas Avenue, Queens',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          dcpRecommendationsubmittedbyname: 'QNBB',
          action: server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          dcpDateofvote: new Date('2020-10-21T01:30:00'),
          dcpBoroughboardrecommendation: 'Disapproved',
          dcpVotingagainstrecommendation: 1,
          dcpVotinginfavorrecommendation: 2,
          dcpVotingabstainingonrecommendation: 3,
        }),
        // #### Duplicate of 19 for votes ####################################
        server.create('disposition', {
          id: 18,
          dcpPublichearinglocation: '345 Purple Street, Manhattan',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          dcpRecommendationsubmittedbyname: 'MNBB',
          action: server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          dcpDateofvote: new Date('2020-11-12T01:30:00'),
          dcpBoroughboardrecommendation: 'Approved',
          dcpVotingagainstrecommendation: 2,
          dcpVotinginfavorrecommendation: 3,
          dcpVotingabstainingonrecommendation: 4,
        }),
        // #### Duplicate of 18 for votes ####################################
        server.create('disposition', {
          id: 19,
          dcpPublichearinglocation: '567 Grapefruit Boulevard, Manhattan',
          dcpDateofpublichearing: new Date('2021-04-14T20:30:00'),
          dcpRecommendationsubmittedbyname: 'MNBB',
          action: server.create('action', { id: 3, dcpName: 'Change to City Map', dcpUlurpnumber: 'N19983dLUP' }),
          dcpDateofvote: new Date('2020-11-12T01:30:00'),
          dcpBoroughboardrecommendation: 'Approved',
          dcpVotingagainstrecommendation: 2,
          dcpVotinginfavorrecommendation: 3,
          dcpVotingabstainingonrecommendation: 4,
        }),
        server.create('disposition', {
          id: 20,
          dcpPublichearinglocation: '908 Cherries Road, Queens',
          dcpDateofpublichearing: new Date('2019-04-14T20:30:00'),
          dcpRecommendationsubmittedbyname: 'QNCB4',
          action: server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          dcpDateofvote: new Date('2020-04-21T01:30:00'),
          dcpCommunityboardrecommendation: 'Approved with Modifications/Conditions',
          dcpVotingagainstrecommendation: 4,
          dcpVotinginfavorrecommendation: 5,
          dcpVotingabstainingonrecommendation: 6,
        }),
        // #### duplicate of 22 for hearings############################################################
        server.create('disposition', {
          id: 21,
          dcpPublichearinglocation: '239 Spaghetti Street, Queens',
          dcpDateofpublichearing: new Date('2021-06-21T14:30:00'),
          dcpRecommendationsubmittedbyname: 'QNCB5',
          action: server.create('action', { id: 3, dcpName: 'Change to City Map', dcpUlurpnumber: 'N19983dLUP' }),
          dcpDateofvote: new Date('2020-05-03T01:30:00'),
          dcpCommunityboardrecommendation: 'Disapproved with Modifications/Conditions',
          dcpVotingagainstrecommendation: 7,
          dcpVotinginfavorrecommendation: 8,
          dcpVotingabstainingonrecommendation: 9,
        }),
        // #### duplicate of 21 for hearings ############################################################
        server.create('disposition', {
          id: 22,
          dcpPublichearinglocation: '239 Spaghetti Street, Queens',
          dcpDateofpublichearing: new Date('2021-06-21T14:30:00'),
          dcpRecommendationsubmittedbyname: 'QNCB5',
          action: server.create('action', { id: 4, dcpName: 'Business Improvement District', dcpUlurpnumber: 'C780076TLK' }),
          dcpDateofvote: new Date('2020-06-29T01:30:00'),
          dcpCommunityboardrecommendation: 'Waived',
          dcpVotingagainstrecommendation: 10,
          dcpVotinginfavorrecommendation: 11,
          dcpVotingabstainingonrecommendation: 12,
        }),
        // #### shouldn't show up ############################################################
        server.create('disposition', {
          id: 23,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpRecommendationsubmittedbyname: 'BXCB2',
          action: server.create('action', { id: 4, dcpName: 'Business Improvement District', dcpUlurpnumber: 'C780076TLK' }),
          dcpDateofvote: null,
          dcpCommunityboardrecommendation: '',
          dcpVotingagainstrecommendation: null,
          dcpVotinginfavorrecommendation: null,
          dcpVotingabstainingonrecommendation: null,
        }),
        // #### hearings waived ############################################################
        server.create('disposition', {
          id: 24,
          dcpPublichearinglocation: 'waived',
          dcpDateofpublichearing: null,
          dcpRecommendationsubmittedbyname: 'BKCB3',
          action: server.create('action', { id: 4, dcpName: 'Business Improvement District', dcpUlurpnumber: 'C780076TLK' }),
          dcpDateofvote: new Date('2020-07-21T01:30:00'),
          dcpCommunityboardrecommendation: 'Disapproved',
          dcpVotingagainstrecommendation: 4,
          dcpVotinginfavorrecommendation: 12,
          dcpVotingabstainingonrecommendation: 1,
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
          statuscode: 'Completed',
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
          displayDate: '2019-10-05T20:31:57.956Z',
          statuscode: 'Completed',
          dcpActualenddate: null,
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
    });

    await visit('/projects/5');

    // #### HEARING TITLE ############################################################
    assert.ok(this.element.querySelector('[data-test-hearing-title="Queens Borough Board"]').textContent.includes('Queens Borough Board Public Hearing'), 'QNBB');
    assert.ok(this.element.querySelector('[data-test-hearing-title="Manhattan Borough Board"]').textContent.includes('Manhattan Borough Board Public Hearing'), 'MNBB');
    assert.ok(this.element.querySelector('[data-test-hearing-title="Queens Community Board 5"]').textContent.includes('Queens Community Board 5 Public Hearing'), 'QNCB5');
    assert.ok(this.element.querySelector('[data-test-hearing-title="Queens Community Board 4"]').textContent.includes('Queens Community Board 4 Public Hearing'), 'QNCB4');
    assert.notOk(find('[data-test-hearing-title="Brooklyn Community Board 3"]'), 'BKCB3');
    assert.notOk(find('[data-test-hearing-title="Bronx Community Board 2"]'), 'BXCB2');

    // #### HEARING LOCATION ############################################################
    assert.ok(this.element.querySelector('[data-test-hearing-location="17"]').textContent.includes('121 Bananas Avenue, Queens'), 'location 17');
    assert.ok(this.element.querySelector('[data-test-hearing-location="18"]').textContent.includes('345 Purple Street, Manhattan'), 'location 18');
    assert.ok(this.element.querySelector('[data-test-hearing-location="19"]').textContent.includes('567 Grapefruit Boulevard, Manhattan'), 'location 19');
    assert.ok(this.element.querySelector('[data-test-hearing-location="20"]').textContent.includes('908 Cherries Road, Queens'), 'location 20');
    assert.ok(this.element.querySelector('[data-test-hearing-location="21"]').textContent.includes('239 Spaghetti Street, Queens'), 'location 21');
    // duplicate
    assert.notOk(find('[data-test-hearing-location="22"]'), 'location 22');
    // not submitted yet
    assert.notOk(find('[data-test-hearing-location="23"]'), 'location 23');
    // waived
    assert.notOk(find('[data-test-hearing-location="24"]'), 'location 24');

    // #### HEARING DATE ############################################################
    assert.ok(this.element.querySelector('[data-test-hearing-date="17"]').textContent.includes('October 21'), 'date 17');
    assert.ok(this.element.querySelector('[data-test-hearing-date="18"]').textContent.includes('October 21'), 'date 18');
    assert.ok(this.element.querySelector('[data-test-hearing-date="19"]').textContent.includes('April 14'), 'date 19');
    assert.ok(this.element.querySelector('[data-test-hearing-date="20"]').textContent.includes('April 14'), 'date 20');
    assert.ok(this.element.querySelector('[data-test-hearing-date="21"]').textContent.includes('June 21'), 'date 21');
    // duplicate
    assert.notOk(find('[data-test-hearing-date="22"]'), 'date 22');
    // not submitted yet
    assert.notOk(find('[data-test-hearing-date="23"]'), 'date 23');
    // waived
    assert.notOk(find('[data-test-hearing-date="24"]'), 'date 24');

    // #### HEARING ACTIONS ############################################################
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="170"]').textContent.includes('Zoning Special Permit'), 'action 170');
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="180"]').textContent.includes('Zoning Special Permit'), 'action 180');
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="190"]').textContent.includes('Change to City Map'), 'action 190');
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="200"]').textContent.includes('Zoning Special Permit'), 'action 200');
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="210"]').textContent.includes('Change to City Map'), 'action 210');
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="211"]').textContent.includes('Business Improvement District'), 'action 211 duplicate');
    // duplicate
    assert.notOk(find('[data-test-hearing-actions-list="220"]'), 'action 220');
    // not submitted yet
    assert.notOk(find('[data-test-hearing-actions-list="230"]'), 'action 230');
    // waived
    assert.notOk(find('[data-test-hearing-actions-list="240"]'), 'action 240');

    // #### VOTE IN FAVOR ############################################################
    assert.ok(this.element.querySelector('[data-test-voting-favor="17"]').textContent.includes('2 In Favor,'), 'favor 17');
    assert.ok(this.element.querySelector('[data-test-voting-favor="18"]').textContent.includes('3 In Favor,'), 'favor 18');
    // duplicate
    assert.notOk(find('[data-test-voting-favor="19"]'), 'favor 19');
    assert.ok(this.element.querySelector('[data-test-voting-favor="20"]').textContent.includes('5 In Favor,'), 'favor 20');
    assert.ok(this.element.querySelector('[data-test-voting-favor="21"]').textContent.includes('8 In Favor,'), 'favor 21');
    assert.ok(this.element.querySelector('[data-test-voting-favor="22"]').textContent.includes('11 In Favor,'), 'favor 22');
    // not submitted yet
    assert.notOk(find('[data-test-voting-favor="23"]'), 'favor 23');
    // waived hearing but still submitted recommendation
    assert.ok(this.element.querySelector('[data-test-voting-favor="24"]').textContent.includes('12 In Favor,'), 'favor 24');

    // #### VOTE AGAINST ############################################################
    assert.ok(this.element.querySelector('[data-test-voting-against="17"]').textContent.includes('1 Against,'), 'against 17');
    assert.ok(this.element.querySelector('[data-test-voting-against="18"]').textContent.includes('2 Against,'), 'against 18');
    // duplicate
    assert.notOk(find('[data-test-voting-favor="19"]'), 'favor 19');
    assert.ok(this.element.querySelector('[data-test-voting-against="20"]').textContent.includes('4 Against,'), 'against 20');
    assert.ok(this.element.querySelector('[data-test-voting-against="21"]').textContent.includes('7 Against,'), 'against 21');
    assert.ok(this.element.querySelector('[data-test-voting-against="22"]').textContent.includes('10 Against,'), 'against 22');
    // not submitted yet
    assert.notOk(find('[data-test-voting-against="23"]'), 'against 23');
    // waived hearing but still submitted recommendation
    assert.ok(this.element.querySelector('[data-test-voting-against="24"]').textContent.includes('4 Against,'), 'against 24');

    // #### VOTE Abstain ############################################################
    assert.ok(this.element.querySelector('[data-test-voting-abstain="17"]').textContent.includes('3 Abstain'), 'abstain 17');
    assert.ok(this.element.querySelector('[data-test-voting-abstain="18"]').textContent.includes('4 Abstain'), 'abstain 18');
    // duplicate
    assert.notOk(find('[data-test-voting-favor="19"]'), 'favor 19');
    assert.ok(this.element.querySelector('[data-test-voting-abstain="20"]').textContent.includes('6 Abstain'), 'abstain 20');
    assert.ok(this.element.querySelector('[data-test-voting-abstain="21"]').textContent.includes('9 Abstain'), 'abstain 21');
    assert.ok(this.element.querySelector('[data-test-voting-abstain="22"]').textContent.includes('12 Abstain'), 'abstain 22');
    // not submitted yet
    assert.notOk(find('[data-test-voting-abstain="23"]'), 'abstain 23');
    // waived hearing but still submitted recommendation
    assert.ok(this.element.querySelector('[data-test-voting-abstain="24"]').textContent.includes('1 Abstain'), 'abstain 24');

    // // #### VOTE DATE ############################################################
    assert.ok(this.element.querySelector('[data-test-vote-date="17"]').textContent.includes('October 21'), 'date 17');
    assert.ok(this.element.querySelector('[data-test-vote-date="18"]').textContent.includes('November 12'), 'date 18');
    // duplicate
    assert.notOk(find('[data-test-vote-favor="19"]'), 'favor 19');
    assert.ok(this.element.querySelector('[data-test-vote-date="20"]').textContent.includes('April 21'), 'date 20');
    assert.ok(this.element.querySelector('[data-test-vote-date="21"]').textContent.includes('May 3'), 'date 21');
    assert.ok(this.element.querySelector('[data-test-vote-date="22"]').textContent.includes('June 29'), 'date 22');
    // not submitted yet
    assert.notOk(find('[data-test-vote-date="23"]'), 'date 23');
    // waived hearing but still submitted recommendation
    assert.ok(this.element.querySelector('[data-test-vote-date="24"]').textContent.includes('July 21'), 'date 24');
    //
    // // #### VOTE RECOMMENDATION ############################################################
    // index = number in a list of similar participant types (e.g. borough board)
    assert.ok(find('[data-test-borough-board-rec="17"]'), 'QNBB thumb');
    assert.ok(find('[data-test-borough-board-rec="18"]'), 'MNBB thumb');
    assert.notOk(find('[data-test-borough-board-rec="19"]'), 'MNBB duplicate thumb'); // duplicate
    assert.ok(find('[data-test-comm-board-rec="20"]'), 'QNCB4 thumb');
    assert.ok(find('[data-test-comm-board-rec="21"]'), 'QNCB5 thumb');
    assert.ok(find('[data-test-comm-board-rec="22"]'), 'QNCB5 thumb');
    assert.ok(find('[data-test-comm-board-rec="24"]'), 'BKCB3 thumb'); // hearings waived but rec submitted
    assert.notOk(find('[data-test-comm-board-rec="23"]'), 'BXCB2 thumb'); // not submitted yet

    // #### VOTE ACTIONS ############################################################
    assert.ok(this.element.querySelector('[data-test-vote-actions-list="170"]').textContent.includes('Zoning Special Permit'), 'action 170');
    assert.ok(this.element.querySelector('[data-test-vote-actions-list="180"]').textContent.includes('Zoning Special Permit'), 'action 180');
    assert.ok(this.element.querySelector('[data-test-vote-actions-list="181"]').textContent.includes('Change to City Map'), 'action 181 (duplicate)');
    assert.ok(this.element.querySelector('[data-test-vote-actions-list="200"]').textContent.includes('Zoning Special Permit'), 'action 200');
    assert.ok(this.element.querySelector('[data-test-vote-actions-list="210"]').textContent.includes('Change to City Map'), 'action 210');
    assert.ok(this.element.querySelector('[data-test-vote-actions-list="220"]').textContent.includes('Business Improvement District'), 'action 220');
    // not submitted yet
    assert.notOk(find('[data-test-vote-actions-list="230"]'), 'action 230');
    // hearings waived but recommendation still submitted
    assert.ok(this.element.querySelector('[data-test-vote-actions-list="220"]').textContent.includes('Business Improvement District'), 'action 220');
  //
  });

  test('hearings-list-for-milestones-list shows up on reviewed tab', async function(assert) {
    // ########## Reviewed #################################################################
    this.server.create('assignment', {
      id: 5,
      tab: 'reviewed',
      project: this.server.create('project', {
        dispositions: [
          server.create('disposition', {
            id: 17,
            dcpPublichearinglocation: 'Purple Street',
            dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
            dcpRecommendationsubmittedbyname: 'QNBB',
            action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 18,
            dcpPublichearinglocation: 'Green Street',
            dcpDateofpublichearing: new Date('2020-04-21T01:30:00'),
            dcpRecommendationsubmittedbyname: 'MNBB',
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

    assert.ok(this.element.querySelector('[data-test-hearing-title="Queens Borough Board"]').textContent.includes('Queens Borough Board Public Hearing'));
    assert.ok(this.element.querySelector('[data-test-hearing-title="Manhattan Borough Board"]').textContent.includes('Manhattan Borough Board Public Hearing'));
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="170"]').textContent.includes('Zoning Special Permit'), 'action 170');
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="180"]').textContent.includes('Zoning Text Amendment'), 'action 180');
    assert.ok(this.element.querySelector('[data-test-hearing-location="17"]').textContent.includes('Purple Street'));
    assert.ok(this.element.querySelector('[data-test-hearing-date="17"]').textContent.includes('October 21'));
    assert.ok(this.element.querySelector('[data-test-hearing-location="18"]').textContent.includes('Green Street'));
    assert.ok(this.element.querySelector('[data-test-hearing-date="18"]').textContent.includes('April 21'));
  });

  test('hearings-list-for-milestones-list shows up on archive tab', async function(assert) {
    // ########## Archive #################################################################
    this.server.create('assignment', {
      id: 5,
      tab: 'archive',
      project: this.server.create('project', {
        dispositions: [
          server.create('disposition', {
            id: 17,
            dcpPublichearinglocation: 'Purple Street',
            dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
            dcpRecommendationsubmittedbyname: 'QNBB',
            action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 18,
            dcpPublichearinglocation: 'Green Street',
            dcpDateofpublichearing: new Date('2020-04-21T01:30:00'),
            dcpRecommendationsubmittedbyname: 'MNBB',
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

    assert.ok(this.element.querySelector('[data-test-hearing-title="Queens Borough Board"]').textContent.includes('Queens Borough Board Public Hearing'));
    assert.ok(this.element.querySelector('[data-test-hearing-title="Manhattan Borough Board"]').textContent.includes('Manhattan Borough Board Public Hearing'));
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="170"]').textContent.includes('Zoning Special Permit'), 'action 170');
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="180"]').textContent.includes('Zoning Text Amendment'), 'action 180');
    assert.ok(this.element.querySelector('[data-test-hearing-location="17"]').textContent.includes('Purple Street'));
    assert.ok(this.element.querySelector('[data-test-hearing-date="17"]').textContent.includes('October 21'));
    assert.ok(this.element.querySelector('[data-test-hearing-location="18"]').textContent.includes('Green Street'));
    assert.ok(this.element.querySelector('[data-test-hearing-date="18"]').textContent.includes('April 21'));
  });
});
