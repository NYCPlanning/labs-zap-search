import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { dedupeAndExtract } from 'labs-zap-search/components/deduped-votes-list';
import EmberObject from '@ember/object';

module('Integration | Component | deduped-votes-list', function(hooks) {
  setupRenderingTest(hooks);

  skip('check that votes list renders correctly when user has submitted votes', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    // dates for dcpDateofpublichearing
    const date_A = new Date('2020-10-21T18:30:00');
    const date_B = new Date('2020-11-12T17:45:00');

    const store = this.owner.lookup('service:store');

    const milestone = store.createRecord('milestone', {
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
      project: store.createRecord('project', {
        id: 1,
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
            statuscode: 'Completed',
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
            statuscode: 'Completed',
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
        dispositions: [
          // Disposition 22 ############## DUPLICATE WITH 23 & 26
          store.createRecord('disposition', {
            id: 22,
            dcpRecommendationsubmittedbyname: 'QNCB2',
            dcpDateofvote: date_A,
            dcpCommunityboardrecommendation: 'Approved',
            dcpVotingagainstrecommendation: 1,
            dcpVotinginfavorrecommendation: 2,
            dcpVotingabstainingonrecommendation: 3,
            action: {
              dcpName: 'Zoning Special Permit',
              dcpUlurpnumber: 'C780076TLK',
            },
          }),
          // Disposition 23 ############## DUPLICATE WITH 22 & 26
          store.createRecord('disposition', {
            id: 23,
            dcpRecommendationsubmittedbyname: 'QNCB2',
            dcpDateofvote: date_A,
            dcpCommunityboardrecommendation: 'Approved',
            dcpVotingagainstrecommendation: 1,
            dcpVotinginfavorrecommendation: 2,
            dcpVotingabstainingonrecommendation: 3,
            action: {
              dcpName: 'Zoning Text Amendment',
              dcpUlurpnumber: 'N860877TCM',
            },
          }),
          // Disposition 24 ############################ DIFFERENT DATE
          store.createRecord('disposition', {
            id: 24,
            dcpRecommendationsubmittedbyname: 'QNCB2',
            dcpDateofvote: date_B,
            dcpCommunityboardrecommendation: 'Approved',
            dcpVotingagainstrecommendation: 1,
            dcpVotinginfavorrecommendation: 2,
            dcpVotingabstainingonrecommendation: 3,
            action: {
              dcpName: 'Business Improvement District',
              dcpUlurpnumber: 'I030148MMQ',
            },
          }),
          // Disposition 25 ############################ DIFFERENT REC
          store.createRecord('disposition', {
            id: 25,
            dcpRecommendationsubmittedbyname: 'QNCB2',
            dcpDateofvote: date_A,
            dcpCommunityboardrecommendation: 'Disapproved',
            dcpVotingagainstrecommendation: 1,
            dcpVotinginfavorrecommendation: 2,
            dcpVotingabstainingonrecommendation: 3,
            action: {
              dcpName: 'Change in City Map',
              dcpUlurpnumber: '200088ZMX',
            },
          }),
          // Disposition 26 ############## DUPLICATE WITH 22 & 23
          store.createRecord('disposition', {
            id: 26,
            dcpRecommendationsubmittedbyname: 'QNCB2',
            dcpDateofvote: date_A,
            dcpCommunityboardrecommendation: 'Approved',
            dcpVotingagainstrecommendation: 1,
            dcpVotinginfavorrecommendation: 2,
            dcpVotingabstainingonrecommendation: 3,
            action: {
              dcpName: 'Enclosed Sidewalk Cafe',
              dcpUlurpnumber: '190172ZMK',
            },
          }),
          // Disposition 27 ############################ DIFFERENT VotingAgainst
          store.createRecord('disposition', {
            id: 27,
            dcpRecommendationsubmittedbyname: 'QNCB2',
            dcpDateofvote: date_A,
            dcpCommunityboardrecommendation: 'Approved',
            dcpVotingagainstrecommendation: 5,
            dcpVotinginfavorrecommendation: 2,
            dcpVotingabstainingonrecommendation: 3,
            action: {
              dcpName: 'Large Scale Special Permit',
              dcpUlurpnumber: 'N190257ZRK',
            },
          }),
          // Disposition 28 ############################ DIFFERENT VotingInFavor
          store.createRecord('disposition', {
            id: 28,
            dcpRecommendationsubmittedbyname: 'QNCB2',
            dcpDateofvote: date_A,
            dcpCommunityboardrecommendation: 'Approved',
            dcpVotingagainstrecommendation: 1,
            dcpVotinginfavorrecommendation: 5,
            dcpVotingabstainingonrecommendation: 3,
            action: {
              dcpName: 'Zoning Certification',
              dcpUlurpnumber: '190256ZMK',
            },
          }),
          // Disposition 29 ############################ DIFFERENT VotingAbstaining
          store.createRecord('disposition', {
            id: 29,
            dcpRecommendationsubmittedbyname: 'QNCB2',
            dcpDateofvote: date_A,
            dcpCommunityboardrecommendation: 'Approved',
            dcpVotingagainstrecommendation: 1,
            dcpVotinginfavorrecommendation: 2,
            dcpVotingabstainingonrecommendation: 5,
            action: {
              dcpName: 'New Restaurant',
              dcpUlurpnumber: '11111',
            },
          }),
          // Disposition 30 ####################################
          store.createRecord('disposition', {
            id: 30,
            dcpRecommendationsubmittedbyname: 'QNCB2',
            dcpDateofvote: date_A,
            dcpCommunityboardrecommendation: 'Approved with Modifications/Conditions',
            dcpVotingagainstrecommendation: 1,
            dcpVotinginfavorrecommendation: 2,
            dcpVotingabstainingonrecommendation: 5,
            action: {
              dcpName: 'New Store',
              dcpUlurpnumber: '22222',
            },
          }),
        ],
      }),
    });

    this.set('milestone', milestone);

    // #deduped-votes-list dispositions=milestoneParticipant.userDispositions participantRecommendationType=milestoneParticipant.participantRecommendationType as |dedupedVotes|

    await render(hbs`
      {{#hearings-list-for-milestones-list milestone=milestone}}
      {{/hearings-list-for-milestones-list}}
    `);

    const list = this.element.textContent.trim();

    assert.equal(list, 'bananas');

    // assert.ok(list.includes('121 Bananas Ave'));
    // assert.ok(list.includes('186 Alligators Ave'));
    // assert.ok(list.includes('144 Piranha Ave'));
    // assert.ok(list.includes('456 Crocodiles Ave'));
    //
    // assert.ok(list.includes('October 21'));
    // assert.ok(list.includes('November 12'));
    //
    // assert.ok(list.includes('C780076TLK'));
    // assert.ok(list.includes('N860877TCM'));
    // assert.ok(list.includes('190172ZMK'));
    // assert.ok(list.includes('I030148MMQ'));
    // assert.ok(list.includes('200088ZMX'));
    // assert.ok(list.includes('N190257ZRK'));
    // assert.ok(list.includes('190256ZMK'));
  });

  test('dedupeAndExtract function works', async function(assert) {
    // dates for dcpDateofpublichearing
    const date_A = new Date('2020-10-21T18:30:00');
    const date_B = new Date('2020-11-12T17:45:00');

    // Create 7 disposition objects to put into dispositions array
    const ourDisps = EmberObject.extend({});

    // Disposition 22 ############## DUPLICATE WITH 23 & 26
    const disp22 = ourDisps.create({
      disposition: ourDisps.create({
        id: 22,
        dcpDateofvote: date_A,
        dcpCommunityboardrecommendation: 'Approved',
        dcpVotingagainstrecommendation: 1,
        dcpVotinginfavorrecommendation: 2,
        dcpVotingabstainingonrecommendation: 3,
        action: {
          dcpName: 'Zoning Special Permit',
          dcpUlurpnumber: 'C780076TLK',
        },
      }),
      voteActions: [
        {
          dcpName: 'Zoning Special Permit',
          dcpUlurpnumber: 'C780076TLK',
        },
      ],
      duplicateDisps: [
        {
          id: 22,
          dcpDateofvote: date_A,
          dcpCommunityboardrecommendation: 'Approved',
          dcpVotingagainstrecommendation: 1,
          dcpVotinginfavorrecommendation: 2,
          dcpVotingabstainingonrecommendation: 3,
          action: {
            dcpName: 'Zoning Special Permit',
            dcpUlurpnumber: 'C780076TLK',
          },
        },
      ],
    });

    // Disposition 23 ############## DUPLICATE WITH 22 & 26
    const disp23 = ourDisps.create({
      disposition: ourDisps.create({
        id: 23,
        dcpDateofvote: date_A,
        dcpCommunityboardrecommendation: 'Approved',
        dcpVotingagainstrecommendation: 1,
        dcpVotinginfavorrecommendation: 2,
        dcpVotingabstainingonrecommendation: 3,
        action: {
          dcpName: 'Zoning Text Amendment',
          dcpUlurpnumber: 'N860877TCM',
        },
      }),
      voteActions: [
        {
          dcpName: 'Zoning Text Amendment',
          dcpUlurpnumber: 'N860877TCM',
        },
      ],
      duplicateDisps: [
        {
          id: 23,
          dcpDateofvote: date_A,
          dcpCommunityboardrecommendation: 'Approved',
          dcpVotingagainstrecommendation: 1,
          dcpVotinginfavorrecommendation: 2,
          dcpVotingabstainingonrecommendation: 3,
          action: {
            dcpName: 'Zoning Text Amendment',
            dcpUlurpnumber: 'N860877TCM',
          },
        },
      ],
    });

    // Disposition 24 ############################ DIFFERENT DATE
    const disp24 = ourDisps.create({
      disposition: ourDisps.create({
        id: 24,
        dcpDateofvote: date_B,
        dcpCommunityboardrecommendation: 'Approved',
        dcpVotingagainstrecommendation: 1,
        dcpVotinginfavorrecommendation: 2,
        dcpVotingabstainingonrecommendation: 3,
        action: {
          dcpName: 'Business Improvement District',
          dcpUlurpnumber: 'I030148MMQ',
        },
      }),
      voteActions: [
        {
          dcpName: 'Business Improvement District',
          dcpUlurpnumber: 'I030148MMQ',
        },
      ],
      duplicateDisps: [
        {
          id: 24,
          dcpDateofvote: date_B,
          dcpCommunityboardrecommendation: 'Approved',
          dcpVotingagainstrecommendation: 1,
          dcpVotinginfavorrecommendation: 2,
          dcpVotingabstainingonrecommendation: 3,
          action: {
            dcpName: 'Business Improvement District',
            dcpUlurpnumber: 'I030148MMQ',
          },
        },
      ],
    });

    // Disposition 25 ############################ DIFFERENT REC
    const disp25 = ourDisps.create({
      disposition: ourDisps.create({
        id: 25,
        dcpDateofvote: date_A,
        dcpCommunityboardrecommendation: 'Disapproved',
        dcpVotingagainstrecommendation: 1,
        dcpVotinginfavorrecommendation: 2,
        dcpVotingabstainingonrecommendation: 3,
        action: {
          dcpName: 'Change in City Map',
          dcpUlurpnumber: '200088ZMX',
        },
      }),
      voteActions: [
        {
          dcpName: 'Change in City Map',
          dcpUlurpnumber: '200088ZMX',
        },
      ],
      duplicateDisps: [
        {
          id: 25,
          dcpDateofvote: date_A,
          dcpCommunityboardrecommendation: 'Disapproved',
          dcpVotingagainstrecommendation: 1,
          dcpVotinginfavorrecommendation: 2,
          dcpVotingabstainingonrecommendation: 3,
          action: {
            dcpName: 'Change in City Map',
            dcpUlurpnumber: '200088ZMX',
          },
        },
      ],
    });

    // Disposition 26 ############## DUPLICATE WITH 22 & 23
    const disp26 = ourDisps.create({
      disposition: ourDisps.create({
        id: 26,
        dcpDateofvote: date_A,
        dcpCommunityboardrecommendation: 'Approved',
        dcpVotingagainstrecommendation: 1,
        dcpVotinginfavorrecommendation: 2,
        dcpVotingabstainingonrecommendation: 3,
        action: {
          dcpName: 'Enclosed Sidewalk Cafe',
          dcpUlurpnumber: '190172ZMK',
        },
      }),
      voteActions: [
        {
          dcpName: 'Enclosed Sidewalk Cafe',
          dcpUlurpnumber: '190172ZMK',
        },
      ],
      duplicateDisps: [
        {
          id: 26,
          dcpDateofvote: date_A,
          dcpCommunityboardrecommendation: 'Approved',
          dcpVotingagainstrecommendation: 1,
          dcpVotinginfavorrecommendation: 2,
          dcpVotingabstainingonrecommendation: 3,
          action: {
            dcpName: 'Enclosed Sidewalk Cafe',
            dcpUlurpnumber: '190172ZMK',
          },
        },
      ],
    });

    // Disposition 27 ############################ DIFFERENT VotingAgainst
    const disp27 = ourDisps.create({
      disposition: ourDisps.create({
        id: 27,
        dcpDateofvote: date_A,
        dcpCommunityboardrecommendation: 'Approved',
        dcpVotingagainstrecommendation: 5,
        dcpVotinginfavorrecommendation: 2,
        dcpVotingabstainingonrecommendation: 3,
        action: {
          dcpName: 'Large Scale Special Permit',
          dcpUlurpnumber: 'N190257ZRK',
        },
      }),
      voteActions: [
        {
          dcpName: 'Large Scale Special Permit',
          dcpUlurpnumber: 'N190257ZRK',
        },
      ],
      duplicateDisps: [
        {
          id: 27,
          dcpDateofvote: date_A,
          dcpCommunityboardrecommendation: 'Approved',
          dcpVotingagainstrecommendation: 5,
          dcpVotinginfavorrecommendation: 2,
          dcpVotingabstainingonrecommendation: 3,
          action: {
            dcpName: 'Large Scale Special Permit',
            dcpUlurpnumber: 'N190257ZRK',
          },
        },
      ],
    });


    // Disposition 28 ############################ DIFFERENT VotingInFavor
    const disp28 = ourDisps.create({
      disposition: ourDisps.create({
        id: 28,
        dcpDateofvote: date_A,
        dcpCommunityboardrecommendation: 'Approved',
        dcpVotingagainstrecommendation: 1,
        dcpVotinginfavorrecommendation: 5,
        dcpVotingabstainingonrecommendation: 3,
        action: {
          dcpName: 'Zoning Certification',
          dcpUlurpnumber: '190256ZMK',
        },
      }),
      voteActions: [
        {
          dcpName: 'Zoning Certification',
          dcpUlurpnumber: '190256ZMK',
        },
      ],
      duplicateDisps: [
        {
          id: 28,
          dcpDateofvote: date_A,
          dcpCommunityboardrecommendation: 'Approved',
          dcpVotingagainstrecommendation: 1,
          dcpVotinginfavorrecommendation: 5,
          dcpVotingabstainingonrecommendation: 3,
          action: {
            dcpName: 'Zoning Certification',
            dcpUlurpnumber: '190256ZMK',
          },
        },
      ],
    });

    // Disposition 29 ############################ DIFFERENT VotingAbstaining
    const disp29 = ourDisps.create({
      disposition: ourDisps.create({
        id: 29,
        dcpDateofvote: date_A,
        dcpCommunityboardrecommendation: 'Approved',
        dcpVotingagainstrecommendation: 1,
        dcpVotinginfavorrecommendation: 2,
        dcpVotingabstainingonrecommendation: 5,
        action: {
          dcpName: 'New Restaurant',
          dcpUlurpnumber: '11111',
        },
      }),
      voteActions: [
        {
          dcpName: 'New Restaurant',
          dcpUlurpnumber: '11111',
        },
      ],
      duplicateDisps: [
        {
          id: 29,
          dcpDateofvote: date_A,
          dcpCommunityboardrecommendation: 'Approved',
          dcpVotingagainstrecommendation: 1,
          dcpVotinginfavorrecommendation: 2,
          dcpVotingabstainingonrecommendation: 5,
          action: {
            dcpName: 'New Restaurant',
            dcpUlurpnumber: '11111',
          },
        },
      ],
    });

    // Disposition 28 ############################ DIFFERENT VotingAbstaining
    const disp30 = ourDisps.create({
      disposition: ourDisps.create({
        id: 30,
        dcpDateofvote: date_A,
        dcpCommunityboardrecommendation: 'Approved with Modifications/Conditions',
        dcpVotingagainstrecommendation: 1,
        dcpVotinginfavorrecommendation: 2,
        dcpVotingabstainingonrecommendation: 5,
        action: {
          dcpName: 'New Store',
          dcpUlurpnumber: '22222',
        },
      }),
      voteActions: [
        {
          dcpName: 'New Store',
          dcpUlurpnumber: '22222',
        },
      ],
      duplicateDisps: [
        {
          id: 30,
          dcpDateofvote: date_A,
          dcpCommunityboardrecommendation: 'Approved with Modifications/Conditions',
          dcpVotingagainstrecommendation: 1,
          dcpVotinginfavorrecommendation: 2,
          dcpVotingabstainingonrecommendation: 5,
          action: {
            dcpName: 'New Restaurant',
            dcpUlurpnumber: '22222',
          },
        },
      ],
    });

    // mimics each project's array of dispositions
    const dispositions = [disp22, disp23, disp24, disp25, disp26, disp27, disp28, disp29, disp30];

    // run the dedupeAndExtract function, which...
    // (1) deduplicates array of objects based on a disposition's dcpPublichearinglocation & dcpDateofpublichearing properties
    // and (2) concatenates properties for duplicate objects
    const deduped = dedupeAndExtract(
      dispositions,
      'dcpDateofvote',
      'dcpVotinginfavorrecommendation',
      'dcpVotingagainstrecommendation',
      'dcpVotingabstainingonrecommendation',
      'dcpCommunityboardrecommendation',
      'action',
      'voteActions',
      'duplicateDisps',
    );

    // check that are our duplicateDisps array has the correct duplicate dispositions
    console.log('deduped', deduped[0]);
    console.log('deduped.duplicateDisps', deduped[0].duplicateDisps);
    assert.equal(deduped[0].duplicateDisps.map(d => d.id).join(','), '22,23,26'); // disp 22, 23, 26
    assert.equal(deduped[1].duplicateDisps.map(d => d.id).join(','), '24'); // disp 24
    assert.equal(deduped[2].duplicateDisps.map(d => d.id).join(','), '25'); // disp 25
    assert.equal(deduped[3].duplicateDisps.map(d => d.id).join(','), '27'); // disp 27
    assert.equal(deduped[4].duplicateDisps.map(d => d.id).join(','), '28'); // disp 28
    assert.equal(deduped[5].duplicateDisps.map(d => d.id).join(','), '29'); // disp 29
    assert.equal(deduped[6].duplicateDisps.map(d => d.id).join(','), '30'); // disp 30
    //
    // check that voteActions array has all actions associated with duplicate disposition
    assert.equal(deduped[0].voteActions.map(d => d.dcpUlurpnumber).join(','), 'C780076TLK,N860877TCM,190172ZMK'); // disp 22, 23, 26
    assert.equal(deduped[1].voteActions.map(d => d.dcpUlurpnumber).join(','), 'I030148MMQ'); // disp 24
    assert.equal(deduped[2].voteActions.map(d => d.dcpUlurpnumber).join(','), '200088ZMX'); // disp 25
    assert.equal(deduped[3].voteActions.map(d => d.dcpUlurpnumber).join(','), 'N190257ZRK'); // disp 27
    assert.equal(deduped[4].voteActions.map(d => d.dcpUlurpnumber).join(','), '190256ZMK'); // disp 28
    assert.equal(deduped[5].voteActions.map(d => d.dcpUlurpnumber).join(','), '11111'); // disp 29
    assert.equal(deduped[6].voteActions.map(d => d.dcpUlurpnumber).join(','), '22222'); // disp 30
  });
});
