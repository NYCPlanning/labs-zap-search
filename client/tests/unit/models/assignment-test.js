import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Model | assignment', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('assignment', {});
    assert.ok(model);
  });

  test('publicReviewPlannedStartDate is calculated correctly', function(assert) {
    const store = this.owner.lookup('service:store');

    const dateA = new Date('2020-10-21T00:00:00'); // October 21, 2020

    const model = run(() => store.createRecord('assignment', {
      project: store.createRecord('project', {
        milestones: [
          store.createRecord('milestone', {
            dcpMilestone: '923beec4-dad0-e711-8116-1458d04e2fb8',
            dcpPlannedstartdate: dateA,
          }),
        ],
      }),
    }));

    assert.equal(model.publicReviewPlannedStartDate, dateA);
  });

  test('hearingsSubmitted calculated correctly', function(assert) {
    const store = this.owner.lookup('service:store');

    const hearingDate = new Date('2020-10-21T18:30:00');

    const disp1 = store.createRecord('disposition', {
      id: 1,
      dcpRepresenting: 'Community Board',
      dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
      dcpDateofpublichearing: hearingDate,
      dcpIspublichearingrequired: '',
    });

    const disp2 = store.createRecord('disposition', {
      id: 2,
      dcpRepresenting: 'Community Board',
      dcpPublichearinglocation: '144 Piranha Ave, Manhattan, NY',
      dcpDateofpublichearing: hearingDate,
      dcpIspublichearingrequired: '',
    });

    const disp3 = store.createRecord('disposition', {
      id: 3,
      dcpRepresenting: 'Community Board',
      dcpPublichearinglocation: '186 Alligators Ave, Staten Island, NY',
      dcpDateofpublichearing: hearingDate,
      dcpIspublichearingrequired: '',
    });

    const model = run(() => store.createRecord('assignment', {
      dcpLupteammemberrole: 'CB',
      dispositions: [disp1, disp2, disp3],
    }));

    assert.equal(model.hearingsSubmitted, true);
    assert.equal(model.hearingsWaived, false);
    assert.equal(model.hearingsSubmittedOrWaived, true);
    assert.equal(model.hearingsNotSubmittedNotWaived, false);
  });

  // Replace this with your real tests.
  test('hearingsWaived calculated correctly', function(assert) {
    const store = this.owner.lookup('service:store');

    const disp1 = store.createRecord('disposition', {
      id: 1,
      dcpRepresenting: 'Community Board',
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
      dcpIspublichearingrequired: 717170001, // No
    });

    const disp2 = store.createRecord('disposition', {
      id: 2,
      dcpRepresenting: 'Community Board',
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
      dcpIspublichearingrequired: 717170001, // No
    });

    const disp3 = store.createRecord('disposition', {
      id: 3,
      dcpRepresenting: 'Community Board',
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
      dcpIspublichearingrequired: 717170001, // No
    });

    const model = run(() => store.createRecord('assignment', {
      dcpLupteammemberrole: 'CB',
      dispositions: [disp1, disp2, disp3],
    }));

    assert.equal(model.hearingsSubmitted, false);
    assert.equal(model.hearingsWaived, true);
    assert.equal(model.hearingsSubmittedOrWaived, true);
    assert.equal(model.hearingsNotSubmittedNotWaived, false);
  });

  // Replace this with your real tests.
  test('hearingsNotSubmittedNotWaived calculated correctly', function(assert) {
    const store = this.owner.lookup('service:store');

    const disp1 = store.createRecord('disposition', {
      id: 1,
      dcpRepresenting: 'Community Board',
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
      dcpIspublichearingrequired: '',
    });

    const disp2 = store.createRecord('disposition', {
      id: 2,
      dcpRepresenting: 'Community Board',
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
      dcpIspublichearingrequired: '',
    });

    const disp3 = store.createRecord('disposition', {
      id: 3,
      dcpRepresenting: 'Community Board',
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
      dcpIspublichearingrequired: '',
    });

    const model = run(() => store.createRecord('assignment', {
      dcpLupteammemberrole: 'CB',
      dispositions: [disp1, disp2, disp3],
    }));

    assert.equal(model.hearingsSubmitted, false);
    assert.equal(model.hearingsWaived, false);
    assert.equal(model.hearingsSubmittedOrWaived, false);
    assert.equal(model.hearingsNotSubmittedNotWaived, true);
  });

  test('Data scenario: disposition subset', function(assert) {
    const store = this.owner.lookup('service:store');

    const model = run(() => store.createRecord('assignment', {
      dcpLupteammemberrole: 'CB',
      project: '2020K0305',
      tab: 'to-review',
      // user: null,
      dispositions: [
        store.createRecord('disposition', {
          fullname: 'Matt Gardner',
          dcpPublichearinglocation: null,
          dcpIspublichearingrequired: null,
          dcpRepresenting: 'Borough Board',
          dcpDateofpublichearing: null,
          dcpNameofpersoncompletingthisform: 'ZAP LUP Portal',
          dcpProjectaction: 'be5e1917-e10e-ea11-a9a9-001dd83080ab',
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
          project: '2020K0305',
          assignment: 'CB-aaf191e5-e00e-ea11-a9a9-001dd83080ab',
        }),
        store.createRecord('disposition', {
          fullname: 'Matt Gardner',
          dcpPublichearinglocation: null,
          dcpIspublichearingrequired: null,
          dcpRepresenting: 'Borough Board',
          dcpDateofpublichearing: null,
          dcpNameofpersoncompletingthisform: 'ZAP LUP Portal',
          dcpProjectaction: '474109a0-ef0e-ea11-a9a9-001dd83080ab',
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
          project: '2020K0305',
          assignment: 'CB-aaf191e5-e00e-ea11-a9a9-001dd83080ab',
        }),
        store.createRecord('disposition', {
          fullname: 'Matt Gardner',
          dcpPublichearinglocation: null,
          dcpIspublichearingrequired: null,
          dcpRepresenting: 'Borough Board',
          dcpDateofpublichearing: null,
          dcpNameofpersoncompletingthisform: 'ZAP LUP Portal',
          dcpProjectaction: 'd13156cb-200f-ea11-a9a9-001dd83080ab',
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
          project: '2020K0305',
          assignment: 'CB-aaf191e5-e00e-ea11-a9a9-001dd83080ab',
        }),
        store.createRecord('disposition', {
          fullname: 'Matt Gardner',
          dcpPublichearinglocation: 'asdf',
          dcpIspublichearingrequired: null,
          dcpRepresenting: 'Community Board',
          dcpDateofpublichearing: '2019-12-27T18:01:00.000Z',
          dcpNameofpersoncompletingthisform: 'ZAP LUP Portal',
          dcpProjectaction: 'be5e1917-e10e-ea11-a9a9-001dd83080ab',
          dcpBoroughpresidentrecommendation: null,
          dcpBoroughboardrecommendation: null,
          dcpCommunityboardrecommendation: null,
          dcpConsideration: null,
          dcpVotelocation: null,
          dcpDatereceived: null,
          dcpDateofvote: null,
          statuscode: 717170000,
          statecode: 0,
          dcpDocketdescription: null,
          dcpVotinginfavorrecommendation: null,
          dcpVotingagainstrecommendation: null,
          dcpVotingabstainingonrecommendation: null,
          dcpTotalmembersappointedtotheboard: null,
          dcpWasaquorumpresent: false,
          project: '2020K0305',
          assignment: 'CB-aaf191e5-e00e-ea11-a9a9-001dd83080ab',
        }),
        store.createRecord('disposition', {
          fullname: 'Matt Gardner',
          dcpPublichearinglocation: 'asdf',
          dcpIspublichearingrequired: null,
          dcpRepresenting: 'Community Board',
          dcpDateofpublichearing: '2019-12-27T18:01:00.000Z',
          dcpNameofpersoncompletingthisform: 'ZAP LUP Portal',
          dcpProjectaction: '474109a0-ef0e-ea11-a9a9-001dd83080ab',
          dcpBoroughpresidentrecommendation: null,
          dcpBoroughboardrecommendation: null,
          dcpCommunityboardrecommendation: null,
          dcpConsideration: null,
          dcpVotelocation: null,
          dcpDatereceived: null,
          dcpDateofvote: null,
          statuscode: 717170000,
          statecode: 0,
          dcpDocketdescription: null,
          dcpVotinginfavorrecommendation: null,
          dcpVotingagainstrecommendation: null,
          dcpVotingabstainingonrecommendation: null,
          dcpTotalmembersappointedtotheboard: null,
          dcpWasaquorumpresent: false,
          project: '2020K0305',
          assignment: 'CB-aaf191e5-e00e-ea11-a9a9-001dd83080ab',
        }),
        store.createRecord('disposition', {
          fullname: 'Matt Gardner',
          dcpPublichearinglocation: 'asdf',
          dcpIspublichearingrequired: null,
          dcpRepresenting: 'Community Board',
          dcpDateofpublichearing: '2019-12-27T18:01:00.000Z',
          dcpNameofpersoncompletingthisform: 'ZAP LUP Portal',
          dcpProjectaction: 'd13156cb-200f-ea11-a9a9-001dd83080ab',
          dcpBoroughpresidentrecommendation: null,
          dcpBoroughboardrecommendation: null,
          dcpCommunityboardrecommendation: null,
          dcpConsideration: null,
          dcpVotelocation: null,
          dcpDatereceived: null,
          dcpDateofvote: null,
          statuscode: 717170000,
          statecode: 0,
          dcpDocketdescription: null,
          dcpVotinginfavorrecommendation: null,
          dcpVotingagainstrecommendation: null,
          dcpVotingabstainingonrecommendation: null,
          dcpTotalmembersappointedtotheboard: null,
          dcpWasaquorumpresent: false,
          project: '2020K0305',
          assignment: 'CB-aaf191e5-e00e-ea11-a9a9-001dd83080ab',
        }),
      ],
    }));

    assert.equal(model.hearingsSubmitted, true);
    assert.equal(model.hearingsWaived, false);
    assert.equal(model.hearingsSubmittedOrWaived, true);
    assert.equal(model.hearingsNotSubmittedNotWaived, false);
  });
});
