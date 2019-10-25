import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { dedupeByParticipant } from 'labs-zap-search/components/hearings-list-for-milestones-list';
import EmberObject from '@ember/object';

module('Integration | Component | hearings-list-for-milestones-list', function(hooks) {
  setupRenderingTest(hooks);

  test('check that hearings list renders when user has submitted hearings on upcoming tab', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    const store = this.owner.lookup('service:store');

    const assignment = store.createRecord('assignment', {
      id: 5,
      tab: 'upcoming',
      publicReviewPlannedStartDate: new Date('2020-10-21T01:30:00'),
      user: store.createRecord('user', {
        name: 'Peter Pan',
        landUseParticipant: 'QNBB',
      }),
      project: store.createRecord('project', {
        dispositions: [
          store.createRecord('disposition', {
            id: 17,
            dcpPublichearinglocation: '121 Bananas Avenue, Queens',
            dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
            dcpRecommendationsubmittedbyname: 'QNBB',
            action: store.createRecord('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          store.createRecord('disposition', {
            id: 18,
            dcpPublichearinglocation: '345 Purple Street, Manhattan',
            dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
            dcpRecommendationsubmittedbyname: 'MNBB',
            action: store.createRecord('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          store.createRecord('disposition', {
            id: 19,
            dcpPublichearinglocation: '567 Grapefruit Boulevard, Manhattan',
            dcpDateofpublichearing: new Date('2021-04-14T20:30:00'),
            dcpRecommendationsubmittedbyname: 'MNBB',
            action: store.createRecord('action', { dcpName: 'Change to City Map', dcpUlurpnumber: 'N19983dLUP' }),
          }),
          store.createRecord('disposition', {
            id: 20,
            dcpPublichearinglocation: '908 Cherries Road, Queens',
            dcpDateofpublichearing: new Date('2021-04-14T20:30:00'),
            dcpRecommendationsubmittedbyname: 'QNCB4',
            action: store.createRecord('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          store.createRecord('disposition', {
            id: 21,
            dcpPublichearinglocation: '239 Spaghetti Street, Queens',
            dcpDateofpublichearing: new Date('2021-06-21T14:30:00'),
            dcpRecommendationsubmittedbyname: 'QNCB5',
            action: store.createRecord('action', { dcpName: 'Change to City Map', dcpUlurpnumber: 'N19983dLUP' }),
          }),
          store.createRecord('disposition', {
            id: 22,
            dcpPublichearinglocation: '239 Spaghetti Street, Queens',
            dcpDateofpublichearing: new Date('2021-06-21T14:30:00'),
            dcpRecommendationsubmittedbyname: 'QNCB5',
            action: store.createRecord('action', { dcpName: 'Business Improvement District', dcpUlurpnumber: 'C780076TLK' }),
          }),
          store.createRecord('disposition', {
            id: 23,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpRecommendationsubmittedbyname: 'BXCB2',
            action: store.createRecord('action', { dcpName: 'Business Improvement District', dcpUlurpnumber: 'C780076TLK' }),
          }),
          store.createRecord('disposition', {
            id: 24,
            dcpPublichearinglocation: 'waived',
            dcpDateofpublichearing: null,
            dcpRecommendationsubmittedbyname: 'BKCB3',
            action: store.createRecord('action', { dcpName: 'Business Improvement District', dcpUlurpnumber: 'C780076TLK' }),
          }),
        ],
        milestones: [
          store.createRecord('milestone', {
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
          store.createRecord('milestone', {
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
          store.createRecord('milestone', {
            displayName: 'Community Board Review',
            dcpMilestonesequence: 48,
            milestonename: 'Community Board Review',
            dcpMilestone: '923beec4-dad0-e711-8116-1458d04e2fb8',
            milestoneLinks: [],
            dcpMilestoneoutcome: null,
            displayDate2: null,
            displayDate: '2019-10-05T20:31:57.956Z',
            statuscode: 'Not Started',
            dcpActualenddate: null,
            dcpActualstartdate: null,
            dcpPlannedcompletiondate: null,
            dcpPlannedstartdate: '2019-10-05T20:31:57.956Z',
            id: '12',
          }),
          store.createRecord('milestone', {
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


    this.set('assignment', assignment);

    await render(hbs`
      {{#upcoming-project-card assignment=assignment}}
      {{/upcoming-project-card}}
    `);

    const list = this.element.textContent.trim();

    // hearings submitted
    assert.ok(list.includes('Queens Borough Board Public Hearing'));
    assert.ok(list.includes('Manhattan Borough Board Public Hearing'));
    assert.ok(list.includes('Queens Community Board 4 Public Hearing'));
    assert.ok(list.includes('Queens Community Board 5 Public Hearing'));
    // hearings waived
    assert.ok(list.includes('No Brooklyn Community Board 3 Hearings Posted'));
    // hearings not submitted yet
    assert.notOk(list.includes('Bronx Community Board 2 Public Hearing'));
  });

  test('dedupeByParticipant function works', async function(assert) {
    // dates for dcpDateofpublichearing
    const date_A = new Date('2020-01-21T18:30:00');
    const date_B = new Date('2020-02-25T17:45:00');
    const date_C = new Date('2020-03-14T09:25:00');
    const date_D = new Date('2021-04-01T14:15:00');
    const date_E = new Date('2021-05-07T15:05:00');

    const ourDisps = EmberObject.extend({});

    const milestoneParticipant1 = {
      landUseParticipantFullName: 'Queens Community Board 1',
      disposition: ourDisps.create({
        id: 1,
        dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
        dcpDateofpublichearing: date_A,
        action: {
          dcpName: 'Zoning Special Permit',
          dcpUlurpnumber: 'C780076TLK',
        },
      }),
      userDispositions: [
        ourDisps.create({
          id: 1,
          dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
          dcpDateofpublichearing: date_A,
          action: {
            dcpName: 'Zoning Special Permit',
            dcpUlurpnumber: 'C780076TLK',
          },
        }),
      ],
    };

    const milestoneParticipant2 = {
      landUseParticipantFullName: 'Queens Community Board 1',
      disposition: ourDisps.create({
        id: 2,
        dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
        dcpDateofpublichearing: date_B,
        action: {
          dcpName: 'Zoning Text Amendment',
          dcpUlurpnumber: 'N860877TCM',
        },
      }),
      userDispositions: [
        ourDisps.create({
          id: 2,
          dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
          dcpDateofpublichearing: date_B,
          action: {
            dcpName: 'Zoning Text Amendment',
            dcpUlurpnumber: 'N860877TCM',
          },
        }),
      ],
    };

    const milestoneParticipant3 = {
      landUseParticipantFullName: 'Queens Community Board 2',
      disposition: ourDisps.create({
        id: 3,
        dcpPublichearinglocation: '186 Alligators Ave, Staten Island, NY',
        dcpDateofpublichearing: date_C,
        action: {
          dcpName: 'Zoning Special Permit',
          dcpUlurpnumber: 'C780076TLK',
        },
      }),
      userDispositions: [
        ourDisps.create({
          id: 3,
          dcpPublichearinglocation: '186 Alligators Ave, Staten Island, NY',
          dcpDateofpublichearing: date_C,
          action: {
            dcpName: 'Zoning Special Permit',
            dcpUlurpnumber: 'C780076TLK',
          },
        }),
      ],
    };

    const milestoneParticipant4 = {
      landUseParticipantFullName: 'Queens Community Board 2',
      disposition: ourDisps.create({
        id: 4,
        dcpPublichearinglocation: '456 Crocodiles Ave, Bronx, NY',
        dcpDateofpublichearing: date_D,
        action: {
          dcpName: 'Zoning Text Amendment',
          dcpUlurpnumber: 'N860877TCM',
        },
      }),
      userDispositions: [
        ourDisps.create({
          id: 4,
          dcpPublichearinglocation: '456 Crocodiles Ave, Bronx, NY',
          dcpDateofpublichearing: date_D,
          action: {
            dcpName: 'Zoning Text Amendment',
            dcpUlurpnumber: 'N860877TCM',
          },
        }),
      ],
    };

    const milestoneParticipant5 = {
      landUseParticipantFullName: 'Queens Community Board 3',
      disposition: ourDisps.create({
        id: 5,
        dcpPublichearinglocation: '456 Crocodiles Ave, Bronx, NY',
        dcpDateofpublichearing: date_E,
        action: {
          dcpName: 'Zoning Special Permit',
          dcpUlurpnumber: 'C780076TLK',
        },
      }),
      userDispositions: [
        ourDisps.create({
          id: 5,
          dcpPublichearinglocation: '456 Crocodiles Ave, Bronx, NY',
          dcpDateofpublichearing: date_E,
          action: {
            dcpName: 'Zoning Special Permit',
            dcpUlurpnumber: 'C780076TLK',
          },
        }),
      ],
    };

    const communityBoardMilestoneParticipants = [milestoneParticipant1, milestoneParticipant2, milestoneParticipant3, milestoneParticipant4, milestoneParticipant5];

    // run the dedupeByParticipant function, which...
    // (1) deduplicates array based on objects having the same `landUseParticipantFullName`
    // and (2) concatenates disposition objects in userDispositions property
    const deduped = dedupeByParticipant(communityBoardMilestoneParticipants);

    assert.equal(deduped[0].landUseParticipantFullName, 'Queens Community Board 1');
    assert.equal(deduped[1].landUseParticipantFullName, 'Queens Community Board 2');
    assert.equal(deduped[2].landUseParticipantFullName, 'Queens Community Board 3');

    assert.equal(deduped[0].userDispositions.map(d => d.id).join(','), '1,2');
    assert.equal(deduped[1].userDispositions.map(d => d.id).join(','), '3,4');
    assert.equal(deduped[2].userDispositions.map(d => d.id).join(','), '5');
  });
});
