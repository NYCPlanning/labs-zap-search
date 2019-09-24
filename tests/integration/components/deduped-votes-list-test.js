import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { dedupeAndExtract } from 'labs-zap-search/components/deduped-votes-list';
import EmberObject from '@ember/object';

module('Integration | Component | deduped-votes-list', function(hooks) {
  setupRenderingTest(hooks);

  test('check that votes list renders when user has submitted recommendations', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    // dates for dcpDateofpublichearing
    const date_A = new Date('2020-10-21T00:00:00');
    const date_C = new Date('2020-11-12T00:00:00');

    const store = this.owner.lookup('service:store');

    const user1 = store.createRecord('user', {
      landUseParticipant: 'QNCB04',
      projects: [
        store.createRecord('project', {
          dcp_name: 'P2012M046',
        }),
      ],
    });

    // Disposition 22 ############## DUPLICATE WITH 23 & 24
    const disp22 = store.createRecord('disposition', {
      id: 22,
      user: user1,
      action: store.createRecord('action', {
        dcpName: 'Zoning Special Permit',
        dcpUlurpnumber: 'C780076TLK',
      }),
      dcpDateofvote: date_A,
      dcpVotingagainstrecommendation: 3,
      dcpVotinginfavorrecommendation: 7,
      dcpVotingabstainingonrecommendation: 1,
      dcpCommunityboardrecommendation: 'Approved',
    });

    // Disposition 23 ############## DUPLICATE WITH 22 & 24
    const disp23 = store.createRecord('disposition', {
      id: 23,
      user: user1,
      action: store.createRecord('action', {
        dcpName: 'Zoning Text Amendment',
        dcpUlurpnumber: 'N860877TCM',
      }),
      dcpDateofvote: date_A,
      dcpVotingagainstrecommendation: 3,
      dcpVotinginfavorrecommendation: 7,
      dcpVotingabstainingonrecommendation: 1,
      dcpCommunityboardrecommendation: 'Approved',
    });

    // Disposition 24 ############## DUPLICATE WITH 22 & 23
    const disp24 = store.createRecord('disposition', {
      id: 24,
      user: user1,
      action: store.createRecord('action', {
        dcpName: 'Business Improvement District',
        dcpUlurpnumber: 'I030148MMQ',
      }),
      dcpDateofvote: date_A,
      dcpVotingagainstrecommendation: 3,
      dcpVotinginfavorrecommendation: 7,
      dcpVotingabstainingonrecommendation: 1,
      dcpCommunityboardrecommendation: 'Approved',
    });

    // Disposition 25 ##########################################################
    const disp25 = store.createRecord('disposition', {
      id: 25,
      user: user1,
      action: store.createRecord('action', {
        dcpName: 'Change in City Map',
        dcpUlurpnumber: '200088ZMX',
      }),
      dcpDateofvote: date_C,
      dcpVotingagainstrecommendation: 3,
      dcpVotinginfavorrecommendation: 7,
      dcpVotingabstainingonrecommendation: 1,
      dcpCommunityboardrecommendation: 'Approved',
    });

    // Disposition 26 #########################################################
    const disp26 = store.createRecord('disposition', {
      id: 26,
      user: user1,
      action: store.createRecord('action', {
        dcpName: 'Enclosed Sidewalk Cafe',
        dcpUlurpnumber: '190172ZMK',
      }),
      dcpDateofvote: date_A,
      dcpVotingagainstrecommendation: 1,
      dcpVotinginfavorrecommendation: 7,
      dcpVotingabstainingonrecommendation: 2,
      dcpCommunityboardrecommendation: 'Approved',
    });

    // Disposition 27 ##########################################################
    const disp27 = store.createRecord('disposition', {
      id: 27,
      user: user1,
      action: store.createRecord('action', {
        dcpName: 'Large Scale Special Permit',
        dcpUlurpnumber: 'N190257ZRK',
      }),
      dcpDateofvote: date_A,
      dcpVotingagainstrecommendation: 3,
      dcpVotinginfavorrecommendation: 7,
      dcpVotingabstainingonrecommendation: 1,
      dcpCommunityboardrecommendation: 'Disapproved',
    });


    // Disposition 28 ##########################################################
    const disp28 = store.createRecord('disposition', {
      id: 28,
      user: user1,
      action: store.createRecord('action', {
        dcpName: 'Zoning Certification',
        dcpUlurpnumber: '190256ZMK',
      }),
      dcpDateofvote: date_A,
      dcpVotingagainstrecommendation: 3,
      dcpVotinginfavorrecommendation: 10,
      dcpVotingabstainingonrecommendation: 1,
      dcpCommunityboardrecommendation: 'Approved',
    });

    const milestone = store.createRecord('milestone', {
      dcpMilestonesequence: 48,
      displayName: 'Community Board Review',
      displayDate: '2019-11-11T22:35:09.161Z',
      project: store.createRecord('project', {
        id: 1,
        tab: 'to-review',
        dcp_name: 'P2012M046',
        dispositions: [disp22, disp23, disp24, disp25, disp26, disp27, disp28],
        users: [user1],
      }),
    });

    this.set('milestone', milestone);

    await render(hbs`
      {{#project-milestone milestone=milestone}}
      {{/project-milestone}}
    `);

    const list = this.element.textContent.trim();

    assert.ok(list.includes('Community Board Review'));
    assert.ok(list.includes('November 11, 2019'));

    assert.ok(list.includes('7 In Favor'));
    assert.ok(list.includes('3 Against'));
    assert.ok(list.includes('1 Abstain'));
    assert.ok(list.includes('October 21, 2020'));
    assert.ok(list.includes('November 12, 2020'));

    assert.ok(list.includes('Zoning Special Permit'));
    assert.ok(list.includes('Zoning Text Amendment'));
    assert.ok(list.includes('Business Improvement District'));
    assert.ok(list.includes('Change in City Map'));
    assert.ok(list.includes('Enclosed Sidewalk Cafe'));
    assert.ok(list.includes('Large Scale Special Permit'));
    assert.ok(list.includes('Zoning Certification'));
  });

  test('dedupeAndExtract function works', async function(assert) {
    // dates for dcpDateofpublichearing
    const date_A = new Date('2020-10-21T18:30:00');
    const date_B = new Date('2020-11-12T17:45:00');
    const date_C = new Date('2020-10-21T09:25:00');

    // Create 7 disposition objects to put into dispositions array
    const ourDisps = EmberObject.extend({});

    // Disposition 22 ############## DUPLICATE WITH 23 & 24
    const disp22 = ourDisps.create({
      id: 22,
      action: {
        dcpName: 'Zoning Special Permit',
        dcpUlurpnumber: 'C780076TLK',
      },
      voteActions: [
        {
          dcpName: 'Zoning Special Permit',
          dcpUlurpnumber: 'C780076TLK',
        },
      ],
      duplicateDisps: [
        {
          id: 22,
          dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
          dcpDateofpublichearing: date_A,
          action: {
            dcpName: 'Zoning Special Permit',
            dcpUlurpnumber: 'C780076TLK',
          },
        },
      ],
      dcpDateofvote: date_A,
      dcpVotingagainstrecommendation: 3,
      dcpVotinginfavorrecommendation: 7,
      dcpVotingabstainingonrecommendation: 1,
      dcpCommunityboardrecommendation: 'Approved',
    });

    // Disposition 23 ############## DUPLICATE WITH 22 & 26
    const disp23 = ourDisps.create({
      id: 23,
      action: {
        dcpName: 'Zoning Text Amendment',
        dcpUlurpnumber: 'N860877TCM',
      },
      voteActions: [
        {
          dcpName: 'Zoning Text Amendment',
          dcpUlurpnumber: 'N860877TCM',
        },
      ],
      duplicateDisps: [
        {
          id: 23,
          dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
          dcpDateofpublichearing: date_A,
          action: {
            dcpName: 'Zoning Text Amendment',
            dcpUlurpnumber: 'N860877TCM',
          },
        },
      ],
      dcpDateofvote: date_A,
      dcpVotingagainstrecommendation: 3,
      dcpVotinginfavorrecommendation: 7,
      dcpVotingabstainingonrecommendation: 1,
      dcpCommunityboardrecommendation: 'Approved',
    });

    // Disposition 24 ############## DUPLICATE WITH 22 & 23
    const disp24 = ourDisps.create({
      id: 24,
      action: {
        dcpName: 'Business Improvement District',
        dcpUlurpnumber: 'I030148MMQ',
      },
      voteActions: [
        {
          dcpName: 'Business Improvement District',
          dcpUlurpnumber: 'I030148MMQ',
        },
      ],
      duplicateDisps: [
        {
          id: 24,
          dcpPublichearinglocation: '186 Alligators Ave, Staten Island, NY',
          dcpDateofpublichearing: date_B,
          action: {
            dcpName: 'Business Improvement District',
            dcpUlurpnumber: 'I030148MMQ',
          },
        },
      ],
      dcpDateofvote: date_A,
      dcpVotingagainstrecommendation: 3,
      dcpVotinginfavorrecommendation: 7,
      dcpVotingabstainingonrecommendation: 1,
      dcpCommunityboardrecommendation: 'Approved',
    });

    // Disposition 25 ##########################################################
    const disp25 = ourDisps.create({
      id: 25,
      action: {
        dcpName: 'Change in City Map',
        dcpUlurpnumber: '200088ZMX',
      },
      voteActions: [
        {
          dcpName: 'Change in City Map',
          dcpUlurpnumber: '200088ZMX',
        },
      ],
      duplicateDisps: [
        {
          id: 25,
          dcpPublichearinglocation: '144 Piranha Ave, Manhattan, NY',
          dcpDateofpublichearing: date_B,
          action: {
            dcpName: 'Change in City Map',
            dcpUlurpnumber: '200088ZMX',
          },
        },
      ],
      dcpDateofvote: date_C,
      dcpVotingagainstrecommendation: 3,
      dcpVotinginfavorrecommendation: 7,
      dcpVotingabstainingonrecommendation: 1,
      dcpCommunityboardrecommendation: 'Approved',
    });

    // Disposition 26 ########################################################
    const disp26 = ourDisps.create({
      id: 26,
      action: {
        dcpName: 'Enclosed Sidewalk Cafe',
        dcpUlurpnumber: '190172ZMK',
      },
      voteActions: [
        {
          dcpName: 'Enclosed Sidewalk Cafe',
          dcpUlurpnumber: '190172ZMK',
        },
      ],
      duplicateDisps: [
        {
          id: 26,
          dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
          dcpDateofpublichearing: date_A,
          action: {
            dcpName: 'Enclosed Sidewalk Cafe',
            dcpUlurpnumber: '190172ZMK',
          },
        },
      ],
      dcpDateofvote: date_A,
      dcpVotingagainstrecommendation: 1,
      dcpVotinginfavorrecommendation: 7,
      dcpVotingabstainingonrecommendation: 2,
      dcpCommunityboardrecommendation: 'Approved',
    });

    // Disposition 27 ##########################################################
    const disp27 = ourDisps.create({
      id: 27,
      action: {
        dcpName: 'Large Scale Special Permit',
        dcpUlurpnumber: 'N190257ZRK',
      },
      voteActions: [
        {
          dcpName: 'Large Scale Special Permit',
          dcpUlurpnumber: 'N190257ZRK',
        },
      ],
      duplicateDisps: [
        {
          id: 27,
          dcpPublichearinglocation: '456 Crocodiles Ave, Bronx, NY',
          dcpDateofpublichearing: date_B,
          action: {
            dcpName: 'Large Scale Special Permit',
            dcpUlurpnumber: 'N190257ZRK',
          },
        },
      ],
      dcpDateofvote: date_A,
      dcpVotingagainstrecommendation: 3,
      dcpVotinginfavorrecommendation: 7,
      dcpVotingabstainingonrecommendation: 1,
      dcpCommunityboardrecommendation: 'Disapproved',
    });


    // Disposition 28 ##########################################################
    const disp28 = ourDisps.create({
      id: 28,
      action: {
        dcpName: 'Zoning Certification',
        dcpUlurpnumber: '190256ZMK',
      },
      voteActions: [
        {
          dcpName: 'Zoning Certification',
          dcpUlurpnumber: '190256ZMK',
        },
      ],
      duplicateDisps: [
        {
          id: 28,
          dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
          dcpDateofpublichearing: date_C,
          action: {
            dcpName: 'Zoning Certification',
            dcpUlurpnumber: '190256ZMK',
          },
        },
      ],
      dcpDateofvote: date_A,
      dcpVotingagainstrecommendation: 3,
      dcpVotinginfavorrecommendation: 10,
      dcpVotingabstainingonrecommendation: 1,
      dcpCommunityboardrecommendation: 'Approved',
    });

    // mimics each project's array of dispositions
    const dispositions = [disp22, disp23, disp24, disp25, disp26, disp27, disp28];

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
    assert.equal(deduped[0].duplicateDisps.map(d => d.id).join(','), '22,23,24'); // disp 22, 23, 24
    assert.equal(deduped[1].duplicateDisps.map(d => d.id).join(','), '25'); // disp 24
    assert.equal(deduped[2].duplicateDisps.map(d => d.id).join(','), '26'); // disp 25
    assert.equal(deduped[3].duplicateDisps.map(d => d.id).join(','), '27'); // disp 27
    assert.equal(deduped[4].duplicateDisps.map(d => d.id).join(','), '28'); // disp 28

    // check that voteActions array has all actions associated with duplicate disposition
    assert.equal(deduped[0].voteActions.map(d => d.dcpUlurpnumber).join(','), 'C780076TLK,N860877TCM,I030148MMQ'); // disp 22, 23, 24
    assert.equal(deduped[1].voteActions.map(d => d.dcpUlurpnumber).join(','), '200088ZMX'); // disp 25
    assert.equal(deduped[2].voteActions.map(d => d.dcpUlurpnumber).join(','), '190172ZMK'); // disp 26
    assert.equal(deduped[3].voteActions.map(d => d.dcpUlurpnumber).join(','), 'N190257ZRK'); // disp 27
    assert.equal(deduped[4].voteActions.map(d => d.dcpUlurpnumber).join(','), '190256ZMK'); // disp 28
  });
});
