import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | disposition', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', async function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('disposition', {});

    assert.ok(model);
  });

  test('when fullNameLongFormat inputs are non-standard, gracefully fail', async function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('disposition', {
      fullname: 'Gale Brewer',
      dcpPublichearinglocation: null,
      dcpIspublichearingrequired: null,
      dcpRepresenting: 'Borough President',
      dcpDateofpublichearing: null,
      dcpNameofpersoncompletingthisform: 'ZAP LUP Portal',
      dcpProjectaction: '53f9d731-add3-e811-8144-1458d04d2538',
      dcpBoroughpresidentrecommendation: null,
      dcpBoroughboardrecommendation: null,
      dcpCommunityboardrecommendation: null,
      dcpConsideration: null,
      dcpVotelocation: null,
      dcpDatereceived: null,
      dcpDateofvote: null,
      statuscode: 1,
      statecode: 0,
      dcpDocketdescription: null,
      dcpVotinginfavorrecommendation: null,
      dcpVotingagainstrecommendation: null,
      dcpVotingabstainingonrecommendation: null,
      dcpTotalmembersappointedtotheboard: null,
      dcpWasaquorumpresent: false,
      project: 'P2018M0285',
      assignment: null,
    });

    assert.ok(model.get('fullNameLongFormat'));
  });

  test('when fullNameLongFormat inputs are correct, success', async function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('disposition', {
      fullname: 'MN CB2',
      dcpPublichearinglocation: 'NYU Silver Building, 32 Waverly Place, Room 206',
      dcpIspublichearingrequired: null,
      dcpRepresenting: 'Community Board',
      dcpDateofpublichearing: '2019-12-11T23:30:00.000Z',
      dcpNameofpersoncompletingthisform: 'ZAP LUP Portal',
      dcpProjectaction: '53f9d731-add3-e811-8144-1458d04d2538',
      dcpBoroughpresidentrecommendation: null,
      dcpBoroughboardrecommendation: null,
      dcpCommunityboardrecommendation: 'Favorable',
      dcpConsideration: null,
      dcpVotelocation: 'Scholastic Building, 130 Mercer St., Auditorium',
      dcpDatereceived: '2019-12-20T19:27:18.000Z',
      dcpDateofvote: '2019-12-19T23:30:00.000Z',
      statuscode: 2,
      statecode: 1,
      dcpDocketdescription: null,
      dcpVotinginfavorrecommendation: 38,
      dcpVotingagainstrecommendation: 49,
      dcpVotingabstainingonrecommendation: 0,
      dcpTotalmembersappointedtotheboard: 49,
      dcpWasaquorumpresent: true,
      project: 'P2018M0285',
      assignment: null,
    });

    assert.equal(model.get('fullNameLongFormat'), 'Manhattan Community Board 2');
  });
});
