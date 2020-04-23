import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { dedupeByParticipant } from 'labs-zap-search/components/hearings-list-for-milestones-list';
import EmberObject from '@ember/object';

module('Integration | Component | hearings-list-for-milestones-list', function(hooks) {
  setupRenderingTest(hooks);

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
