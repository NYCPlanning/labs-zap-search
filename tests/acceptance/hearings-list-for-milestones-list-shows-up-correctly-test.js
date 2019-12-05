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

  test('hearings-list-for-milestones-list shows up correctly on show-project', async function(assert) {
    this.server.create('project', {
      id: 5,
      dispositions: [
        server.create('disposition', {
          id: 17,
          dcpPublichearinglocation: '121 Bananas Avenue, Queens',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          fullname: 'QN BB',
          dcpProjectaction: '1',
          // action: server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          dcpDateofvote: new Date('2020-10-21T01:30:00'),
          dcpBoroughboardrecommendation: 717170002,
          dcpVotingagainstrecommendation: 1,
          dcpVotinginfavorrecommendation: 2,
          dcpVotingabstainingonrecommendation: 3,
        }),
        // #### Duplicate of 19 for votes ####################################
        server.create('disposition', {
          id: 18,
          dcpPublichearinglocation: '345 Purple Street, Manhattan',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          fullname: 'MN BB',
          dcpProjectaction: '1',
          // action: server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          dcpDateofvote: new Date('2020-11-12T01:30:00'),
          dcpBoroughboardrecommendation: 717170000,
          dcpVotingagainstrecommendation: 2,
          dcpVotinginfavorrecommendation: 3,
          dcpVotingabstainingonrecommendation: 4,
        }),
        // #### Duplicate of 18 for votes ####################################
        server.create('disposition', {
          id: 19,
          dcpPublichearinglocation: '567 Grapefruit Boulevard, Manhattan',
          dcpDateofpublichearing: new Date('2021-04-14T20:30:00'),
          fullname: 'MN BB',
          dcpProjectaction: '2',
          // action: server.create('action', { id: 3, dcpName: 'Change to City Map', dcpUlurpnumber: 'N19983dLUP' }),
          dcpDateofvote: new Date('2020-11-12T01:30:00'),
          dcpBoroughboardrecommendation: 717170000,
          dcpVotingagainstrecommendation: 2,
          dcpVotinginfavorrecommendation: 3,
          dcpVotingabstainingonrecommendation: 4,
        }),
        server.create('disposition', {
          id: 20,
          dcpPublichearinglocation: '908 Cherries Road, Queens',
          dcpDateofpublichearing: new Date('2019-04-14T20:30:00'),
          fullname: 'QN CB4',
          dcpProjectaction: '1',
          // action: server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          dcpDateofvote: new Date('2020-04-21T01:30:00'),
          dcpCommunityboardrecommendation: 717170001,
          dcpVotingagainstrecommendation: 4,
          dcpVotinginfavorrecommendation: 5,
          dcpVotingabstainingonrecommendation: 6,
        }),
        // #### duplicate of 22 for hearings############################################################
        server.create('disposition', {
          id: 21,
          dcpPublichearinglocation: '239 Spaghetti Street, Queens',
          dcpDateofpublichearing: new Date('2021-06-21T14:30:00'),
          fullname: 'QN CB5',
          dcpProjectaction: '2',
          // action: server.create('action', { id: 3, dcpName: 'Change to City Map', dcpUlurpnumber: 'N19983dLUP' }),
          dcpDateofvote: new Date('2020-05-03T01:30:00'),
          dcpCommunityboardrecommendation: 717170003,
          dcpVotingagainstrecommendation: 7,
          dcpVotinginfavorrecommendation: 8,
          dcpVotingabstainingonrecommendation: 9,
        }),
        // #### duplicate of 21 for hearings ############################################################
        server.create('disposition', {
          id: 22,
          dcpPublichearinglocation: '239 Spaghetti Street, Queens',
          dcpDateofpublichearing: new Date('2021-06-21T14:30:00'),
          fullname: 'QN CB5',
          dcpProjectaction: '3',
          // action: server.create('action', { id: 4, dcpName: 'Business Improvement District', dcpUlurpnumber: 'C780076TLK' }),
          dcpDateofvote: new Date('2020-06-29T01:30:00'),
          // 717170008 corresponds to CB "Waiver of Recommendation"
          dcpCommunityboardrecommendation: 717170008,
          dcpVotingagainstrecommendation: 10,
          dcpVotinginfavorrecommendation: 11,
          dcpVotingabstainingonrecommendation: 12,
        }),
        // #### shouldn't show up ############################################################
        server.create('disposition', {
          id: 23,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          fullname: 'BX CB2',
          dcpProjectaction: '3',
          // action: server.create('action', { id: 4, dcpName: 'Business Improvement District', dcpUlurpnumber: 'C780076TLK' }),
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
          fullname: 'BK CB3',
          dcpProjectaction: '3',
          // action: server.create('action', { id: 4, dcpName: 'Business Improvement District', dcpUlurpnumber: 'C780076TLK' }),
          dcpDateofvote: new Date('2020-07-21T01:30:00'),
          dcpCommunityboardrecommendation: 717170002,
          dcpVotingagainstrecommendation: 4,
          dcpVotinginfavorrecommendation: 12,
          dcpVotingabstainingonrecommendation: 1,
        }),
      ],
      actions: [
        server.create('action', { id: '1', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        server.create('action', { id: '2', dcpName: 'Change to City Map', dcpUlurpnumber: 'N19983dLUP' }),
        server.create('action', { id: '3', dcpName: 'Business Improvement District', dcpUlurpnumber: 'C780076TLK' }),
      ],
      milestones: [
        server.create('milestone', {
          displayName: 'Land Use Application Filed',
          dcpMilestonesequence: 26,
          milestonename: 'Land Use Application Filed',
          dcpMilestone: '663beec4-dad0-e711-8116-1458d04e2fb8',
          outcome: null,
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
          outcome: null,
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
          outcome: null,
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
          outcome: null,
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

    // #### LUP TITLE ############################################################
    assert.ok(this.element.querySelector('[data-test-lup-full-name="Queens Borough Board"]').textContent.includes('Queens Borough Board'), 'QNBB');
    assert.ok(this.element.querySelector('[data-test-lup-full-name="Manhattan Borough Board"]').textContent.includes('Manhattan Borough Board'), 'MNBB');
    assert.ok(this.element.querySelector('[data-test-lup-full-name="Queens Community Board 5"]').textContent.includes('Queens Community Board 5'), 'QNCB5');
    assert.ok(this.element.querySelector('[data-test-lup-full-name="Queens Community Board 4"]').textContent.includes('Queens Community Board 4'), 'QNCB4');
    assert.notOk(find('[data-test-lup-full-name="Bronx Community Board 2"]'), 'BXCB2');

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

    // // #### VOTE RECOMMENDATION ############################################################
    assert.ok(this.element.querySelector('[data-test-rec-label="17"]').textContent.includes('Waiver of Recommendation'), 'QNBB rec');
    assert.ok(this.element.querySelector('[data-test-rec-label="18"]').textContent.includes('Favorable'), 'MNBB rec');
    assert.notOk(find('[data-test-rec-label="19"]'), 'MNBB duplicate rec'); // duplicate
    assert.ok(this.element.querySelector('[data-test-rec-label="20"]').textContent.includes('Approved with Modifications/Conditions'), 'QNCB4 rec');
    assert.ok(this.element.querySelector('[data-test-rec-label="21"]').textContent.includes('Disapproved with Modifications/Conditions'), 'QNCB5 rec');
    assert.ok(this.element.querySelector('[data-test-rec-label="22"]').textContent.includes('Waiver of Recommendation'), 'QNCB5 rec');
    assert.ok(this.element.querySelector('[data-test-rec-label="24"]').textContent.includes('Disapproved'), 'BKCB3 rec'); // hearings waived but rec submitted
    assert.notOk(find('[data-test-rec-label="23"]'), 'BXCB2 rec'); // not submitted yet

    // // #### VOTE RECOMMENDATION SYMBOL ############################################################
    assert.ok(find('[data-test-rec-symbol="17"]'), 'QNBB thumb');
    assert.ok(find('[data-test-rec-symbol="18"]'), 'MNBB thumb');
    assert.notOk(find('[data-test-rec-symbol="19"]'), 'MNBB duplicate thumb'); // duplicate
    assert.ok(find('[data-test-rec-symbol="20"]'), 'QNCB4 thumb');
    assert.ok(find('[data-test-rec-symbol="21"]'), 'QNCB5 thumb');
    assert.ok(find('[data-test-rec-symbol="22"]'), 'QNCB5 thumb');
    assert.ok(find('[data-test-rec-symbol="24"]'), 'BKCB3 thumb'); // hearings waived but rec submitted
    assert.notOk(find('[data-test-rec-symbol="23"]'), 'BXCB2 thumb'); // not submitted yet

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
  });

  test('milestones list is not broken by a NULL fullname value on show-project page', async function(assert) {
    this.server.create('project', {
      id: 5,
      dispositions: [
        server.create('disposition', {
          id: 17,
          dcpPublichearinglocation: '121 Bananas Avenue, Queens',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          fullname: null,
          dcpProjectaction: '1',
          // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
      ],
      actions: [
        server.create('action', { id: '1', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
      ],
      milestones: [
        server.create('milestone', {
          displayName: 'Land Use Application Filed',
          dcpMilestonesequence: 26,
          milestonename: 'Land Use Application Filed',
          dcpMilestone: '663beec4-dad0-e711-8116-1458d04e2fb8',
          outcome: null,
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
          outcome: null,
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
          outcome: null,
          displayDate2: '2019-10-29T20:31:57.956Z',
          displayDate: '2019-10-05T20:31:57.956Z',
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
          outcome: null,
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

    assert.ok(this.element.querySelector('[data-test-milestone-name="1"]').textContent.includes('Land Use Application Filed'), 'land use app filed milestone');
    assert.ok(this.element.querySelector('[data-test-milestone-name="11"]').textContent.includes('Application Reviewed at City Planning Commission Review Session'), 'CPC milestone');
    assert.ok(this.element.querySelector('[data-test-milestone-name="12"]').textContent.includes('Community Board Review'), 'CB milestone');
    assert.ok(this.element.querySelector('[data-test-milestone-name="38"]').textContent.includes('Borough Board Review'), 'BB milestone');

    assert.ok(this.element.querySelector('[data-test-milestone-dates="1"]').textContent.includes, 'July 13, 2019');
    assert.ok(this.element.querySelector('[data-test-milestone-dates="11"]').textContent.includes, 'October 18, 2019');
    assert.ok(this.element.querySelector('[data-test-milestone-dates="12"]').textContent.includes, 'October 5 - October 29, 2019');
    assert.ok(this.element.querySelector('[data-test-milestone-dates="38"]').textContent.includes, 'October 7 - November 6, 2019');
  });

  test('milestones list is not broken by an empty hearing location value on show-project page', async function(assert) {
    this.server.create('project', {
      id: 5,
      dispositions: [
        // disp with empty location value
        // there are other dispositions that belong to this user that DO have filled date and location values
        // these other dispositions should still show up, but this one should not
        server.create('disposition', {
          id: 17,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          fullname: 'QN CB14',
          dcpProjectaction: '1',
          // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
        // duplicate of disp 18
        server.create('disposition', {
          id: 18,
          dcpPublichearinglocation: 'my location',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          fullname: 'QN CB14',
          dcpProjectaction: '2',
        }),
        // duplicate of disp 19
        server.create('disposition', {
          id: 19,
          dcpPublichearinglocation: 'my location',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          fullname: 'QN CB14',
          dcpProjectaction: '3',
        }),
        server.create('disposition', {
          id: 20,
          dcpPublichearinglocation: 'my location #2',
          dcpDateofpublichearing: new Date('2020-10-22T01:30:00'),
          fullname: 'QN CB14',
          dcpProjectaction: '4',
        }),
        // disp with different user, but empty location
        // this tests that the "Queens Community Board 15" title does not show up
        // because there are no QN CB15 dispositions that have date and location filled
        server.create('disposition', {
          id: 21,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          fullname: 'QN CB15',
          dcpProjectaction: '4',
        }),
      ],
      actions: [
        server.create('action', { id: '1', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'A780076TLK' }),
        server.create('action', { id: '2', dcpName: 'Zoning Map Amendment', dcpUlurpnumber: 'B90366ZSQ' }),
        server.create('action', { id: '3', dcpName: 'Change in City Map', dcpUlurpnumber: 'C781176TLK' }),
        server.create('action', { id: '4', dcpName: 'Landmarks - Individual Sites', dcpUlurpnumber: 'D781176HYU' }),
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
          displayDate2: '2019-10-29T20:31:57.956Z',
          displayDate: '2019-10-05T20:31:57.956Z',
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
    });

    await visit('/projects/5');

    // make sure that rest of milestones list shows up
    assert.ok(this.element.querySelector('[data-test-milestone-name="1"]').textContent.includes('Land Use Application Filed'), 'land use app filed milestone');
    assert.ok(this.element.querySelector('[data-test-milestone-name="11"]').textContent.includes('Application Reviewed at City Planning Commission Review Session'), 'CPC milestone');
    assert.ok(this.element.querySelector('[data-test-milestone-name="12"]').textContent.includes('Community Board Review'), 'CB milestone');
    assert.ok(this.element.querySelector('[data-test-milestone-name="38"]').textContent.includes('Borough Board Review'), 'BB milestone');

    // #### LUP TITLE ############################################################
    // "Queens Community Board 14" has three dispositions that have filled date and location values, so a title SHOULD show up
    assert.ok(this.element.querySelector('[data-test-lup-full-name="Queens Community Board 14"]').textContent.includes('Queens Community Board 14'), 'QNCB14');
    // "Queens Community Board 15" has NO dispositions that have filled date and location values, so a title should NOT show up
    assert.notOk(find('[data-test-lup-full-name="Queens Community Board 15"]'), 'QNCB15');

    // #### HEARING LOCATION ############################################################
    // disp 17 location should not show up because it has an empty location
    assert.notOk(find('[data-test-hearing-location="17"]'), 'location 17');
    // disp 18 and 19 are duplicates
    assert.ok(this.element.querySelector('[data-test-hearing-location="18"]').textContent.includes('my location'), 'location 18');
    // disp 18 and 19 are duplicates so #19 location should not show up
    assert.notOk(find('[data-test-hearing-location="19"]'), 'location 19');
    // disp 20 location should show up
    assert.ok(this.element.querySelector('[data-test-hearing-location="20"]').textContent.includes('my location #2'), 'location 20');
    // disp 21 location should not show up
    assert.notOk(find('[data-test-hearing-location="21"]'), 'location 21');

    // #### HEARING DATE ############################################################
    // disp 17 date should not show up because it has an empty location
    assert.notOk(find('[data-test-hearing-date="17"]'), 'date 17');
    // disp 18 and 19 are duplicates
    assert.ok(this.element.querySelector('[data-test-hearing-date="18"]').textContent.includes('October 21, 2020'), 'date 18');
    // disp 18 and 19 are duplicates so #19 date should not show up
    assert.notOk(find('[data-test-hearing-date="19"]'), 'date 19');
    // disp 20 date should show up
    assert.ok(this.element.querySelector('[data-test-hearing-date="20"]').textContent.includes('October 22, 2020'), 'date 20');
    // disp 21 date should not show up
    assert.notOk(find('[data-test-hearing-date="21"]'), 'date 21');
  });

  test('milestones list is not broken by a NULL hearing date value on show-project page', async function(assert) {
    this.server.create('project', {
      id: 5,
      dispositions: [
        // disp with null date value
        // there are other dispositions that belong to this user that DO have filled date and location values
        // these other dispositions should still show up, but this one should not
        server.create('disposition', {
          id: 17,
          dcpPublichearinglocation: '555 Bananas Ave',
          dcpDateofpublichearing: null,
          fullname: 'QN CB14',
          dcpProjectaction: '1',
          // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
        // duplicate of disp 18
        server.create('disposition', {
          id: 18,
          dcpPublichearinglocation: 'my location',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          fullname: 'QN CB14',
          dcpProjectaction: '2',
        }),
        // duplicate of disp 19
        server.create('disposition', {
          id: 19,
          dcpPublichearinglocation: 'my location',
          dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
          fullname: 'QN CB14',
          dcpProjectaction: '3',
        }),
        server.create('disposition', {
          id: 20,
          dcpPublichearinglocation: 'my location #2',
          dcpDateofpublichearing: new Date('2020-10-22T01:30:00'),
          fullname: 'QN CB14',
          dcpProjectaction: '4',
        }),
        // disp with different user, but null date
        // this tests that the "Queens Community Board 15" title does not show up
        // because there are no QN CB15 dispositions that have date and location filled
        server.create('disposition', {
          id: 21,
          dcpPublichearinglocation: '555 Bananas Ave',
          dcpDateofpublichearing: null,
          fullname: 'QN CB15',
          dcpProjectaction: '4',
        }),
      ],
      actions: [
        server.create('action', { id: '1', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'A780076TLK' }),
        server.create('action', { id: '2', dcpName: 'Zoning Map Amendment', dcpUlurpnumber: 'B90366ZSQ' }),
        server.create('action', { id: '3', dcpName: 'Change in City Map', dcpUlurpnumber: 'C781176TLK' }),
        server.create('action', { id: '4', dcpName: 'Landmarks - Individual Sites', dcpUlurpnumber: 'D781176HYU' }),
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
          displayDate2: '2019-10-29T20:31:57.956Z',
          displayDate: '2019-10-05T20:31:57.956Z',
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
    });

    await visit('/projects/5');

    // make sure that rest of milestones list shows up
    assert.ok(this.element.querySelector('[data-test-milestone-name="1"]').textContent.includes('Land Use Application Filed'), 'land use app filed milestone');
    assert.ok(this.element.querySelector('[data-test-milestone-name="11"]').textContent.includes('Application Reviewed at City Planning Commission Review Session'), 'CPC milestone');
    assert.ok(this.element.querySelector('[data-test-milestone-name="12"]').textContent.includes('Community Board Review'), 'CB milestone');
    assert.ok(this.element.querySelector('[data-test-milestone-name="38"]').textContent.includes('Borough Board Review'), 'BB milestone');

    // #### LUP TITLE ############################################################
    // "Queens Community Board 14" has three dispositions that have filled date and location values, so a title SHOULD show up
    assert.ok(this.element.querySelector('[data-test-lup-full-name="Queens Community Board 14"]').textContent.includes('Queens Community Board 14'), 'QNCB14');
    // "Queens Community Board 15" has NO dispositions that have filled date and location values, so a title should NOT show up
    assert.notOk(find('[data-test-lup-full-name="Queens Community Board 15"]'), 'QNCB15');

    // #### HEARING LOCATION ############################################################
    // disp 17 location should not show up because it has an null date
    assert.notOk(find('[data-test-hearing-location="17"]'), 'location 17');
    // disp 18 and 19 are duplicates
    assert.ok(this.element.querySelector('[data-test-hearing-location="18"]').textContent.includes('my location'), 'location 18');
    // disp 18 and 19 are duplicates so #19 location should not show up
    assert.notOk(find('[data-test-hearing-location="19"]'), 'location 19');
    // disp 20 location should show up
    assert.ok(this.element.querySelector('[data-test-hearing-location="20"]').textContent.includes('my location #2'), 'location 20');
    // disp 21 location should not show up
    assert.notOk(find('[data-test-hearing-location="21"]'), 'location 21');

    // #### HEARING DATE ############################################################
    // disp 17 date should not show up because it has an null date
    assert.notOk(find('[data-test-hearing-date="17"]'), 'date 17');
    // disp 18 and 19 are duplicates
    assert.ok(this.element.querySelector('[data-test-hearing-date="18"]').textContent.includes('October 21, 2020'), 'date 18');
    // disp 18 and 19 are duplicates so #19 date should not show up
    assert.notOk(find('[data-test-hearing-date="19"]'), 'date 19');
    // disp 20 date should show up
    assert.ok(this.element.querySelector('[data-test-hearing-date="20"]').textContent.includes('October 22, 2020'), 'date 20');
    // disp 21 date should not show up
    assert.notOk(find('[data-test-hearing-date="21"]'), 'date 21');
  });

  test('votes do not show up if one of the five required fields is missing', async function(assert) {
    this.server.create('project', {
      id: 5,
      dispositions: [
        // NULL dcpDateofvote
        server.create('disposition', {
          id: 17,
          fullname: 'QN BB',
          dcpProjectaction: '1',
          // action: server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          dcpDateofvote: null,
          dcpBoroughboardrecommendation: 717170002,
          dcpVotingagainstrecommendation: 1,
          dcpVotinginfavorrecommendation: 2,
          dcpVotingabstainingonrecommendation: 3,
        }),
        // empty dcpBoroughboardrecommendation
        server.create('disposition', {
          id: 18,
          fullname: 'QN BB',
          dcpProjectaction: '1',
          // action: server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          dcpDateofvote: new Date('2020-10-21T01:30:00'),
          dcpBoroughboardrecommendation: '',
          dcpVotingagainstrecommendation: 1,
          dcpVotinginfavorrecommendation: 2,
          dcpVotingabstainingonrecommendation: 3,
        }),
        // null dcpVotingagainstrecommendation
        server.create('disposition', {
          id: 19,
          fullname: 'QN BB',
          dcpProjectaction: '1',
          // action: server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          dcpDateofvote: new Date('2020-10-21T01:30:00'),
          dcpBoroughboardrecommendation: 717170002,
          dcpVotingagainstrecommendation: null,
          dcpVotinginfavorrecommendation: 2,
          dcpVotingabstainingonrecommendation: 3,
        }),
        // null dcpVotinginfavorrecommendation
        server.create('disposition', {
          id: 20,
          fullname: 'QN BB',
          dcpProjectaction: '1',
          // action: server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          dcpDateofvote: new Date('2020-10-21T01:30:00'),
          dcpBoroughboardrecommendation: 717170002,
          dcpVotingagainstrecommendation: 1,
          dcpVotinginfavorrecommendation: null,
          dcpVotingabstainingonrecommendation: 3,
        }),
        // null dcpVotingabstainingonrecommendation
        server.create('disposition', {
          id: 21,
          fullname: 'QN BB',
          dcpProjectaction: '1',
          // action: server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          dcpDateofvote: new Date('2020-10-21T01:30:00'),
          dcpBoroughboardrecommendation: 717170002,
          dcpVotingagainstrecommendation: 1,
          dcpVotinginfavorrecommendation: 2,
          dcpVotingabstainingonrecommendation: null,
        }),
        // no missing values
        server.create('disposition', {
          id: 22,
          fullname: 'QN BB',
          dcpProjectaction: '1',
          // action: server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          dcpDateofvote: new Date('2020-10-21T01:30:00'),
          dcpBoroughboardrecommendation: 717170002,
          dcpVotingagainstrecommendation: 1,
          dcpVotinginfavorrecommendation: 2,
          dcpVotingabstainingonrecommendation: 3,
        }),
        // different user with missing dcpDateofvote
        server.create('disposition', {
          id: 23,
          fullname: 'QN CB4',
          dcpProjectaction: '1',
          // action: server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          dcpDateofvote: null,
          dcpBoroughboardrecommendation: 717170002,
          dcpVotingagainstrecommendation: 1,
          dcpVotinginfavorrecommendation: 2,
          dcpVotingabstainingonrecommendation: null,
        }),
      ],
      actions: [
        server.create('action', { id: '1', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        server.create('action', { id: '2', dcpName: 'Change to City Map', dcpUlurpnumber: 'N19983dLUP' }),
        server.create('action', { id: '3', dcpName: 'Business Improvement District', dcpUlurpnumber: 'C780076TLK' }),
      ],
      milestones: [
        server.create('milestone', {
          displayName: 'Land Use Application Filed',
          dcpMilestonesequence: 26,
          milestonename: 'Land Use Application Filed',
          dcpMilestone: '663beec4-dad0-e711-8116-1458d04e2fb8',
          outcome: null,
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
          outcome: null,
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
          outcome: null,
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
          outcome: null,
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

    // #### LUP TITLE ############################################################
    assert.notOk(find('[data-test-lup-full-name="Queens Community Board 4"]'), 'QNCB4');
    assert.ok(find('[data-test-lup-full-name="Queens Borough Board"]'), 'QN BB');

    // #### VOTE IN FAVOR ############################################################
    assert.notOk(find('[data-test-voting-favor="17"]'), 'favor 17');
    assert.notOk(find('[data-test-voting-favor="18"]'), 'favor 18');
    assert.notOk(find('[data-test-voting-favor="19"]'), 'favor 19');
    assert.notOk(find('[data-test-voting-favor="20"]'), 'favor 20');
    assert.notOk(find('[data-test-voting-favor="21"]'), 'favor 21');
    assert.ok(this.element.querySelector('[data-test-voting-favor="22"]').textContent.includes('2'), 'favor 22');
    assert.notOk(find('[data-test-voting-favor="23"]'), 'favor 23');

    // #### VOTE AGAINST ############################################################
    assert.notOk(find('[data-test-voting-against="17"]'), 'against 17');
    assert.notOk(find('[data-test-voting-against="18"]'), 'against 18');
    assert.notOk(find('[data-test-voting-against="19"]'), 'against 19');
    assert.notOk(find('[data-test-voting-against="20"]'), 'against 20');
    assert.notOk(find('[data-test-voting-against="21"]'), 'against 21');
    assert.ok(this.element.querySelector('[data-test-voting-against="22"]').textContent.includes('1'), 'against 22');
    assert.notOk(find('[data-test-voting-against="23"]'), 'against 23');

    // #### VOTE Abstain ############################################################
    assert.notOk(find('[data-test-voting-abstain="17"]'), 'abstain 17');
    assert.notOk(find('[data-test-voting-abstain="18"]'), 'abstain 18');
    assert.notOk(find('[data-test-voting-abstain="19"]'), 'abstain 19');
    assert.notOk(find('[data-test-voting-abstain="20"]'), 'abstain 20');
    assert.notOk(find('[data-test-voting-abstain="21"]'), 'abstain 21');
    assert.ok(this.element.querySelector('[data-test-voting-abstain="22"]').textContent.includes('3'), 'abstain 22');
    assert.notOk(find('[data-test-voting-abstain="23"]'), 'abstain 23');

    // // #### VOTE DATE ############################################################
    assert.notOk(find('[data-test-vote-date="17"]'), 'date 17');
    assert.notOk(find('[data-test-vote-date="18"]'), 'date 18');
    assert.notOk(find('[data-test-vote-date="19"]'), 'date 19');
    assert.notOk(find('[data-test-vote-date="20"]'), 'date 20');
    assert.notOk(find('[data-test-vote-date="21"]'), 'date 21');
    assert.ok(this.element.querySelector('[data-test-vote-date="22"]').textContent.includes('October 21, 2020'), 'date 22');
    assert.notOk(find('[data-test-vote-date="23"]'), 'date 23');

    // // #### VOTE RECOMMENDATION ############################################################
    assert.notOk(find('[data-test-rec-label="17"]'), 'rec 17');
    assert.notOk(find('[data-test-rec-label="18"]'), 'rec 18');
    assert.notOk(find('[data-test-rec-label="19"]'), 'rec 19');
    assert.notOk(find('[data-test-rec-label="20"]'), 'rec 20');
    assert.notOk(find('[data-test-rec-label="21"]'), 'rec 21');
    assert.ok(this.element.querySelector('[data-test-rec-label="22"]').textContent.includes('Waiver of Recommendation'), 'rec 22');
    assert.notOk(find('[data-test-rec-label="23"]'), 'rec 23');
  });
});
