import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { STATUSCODES, STATECODES } from 'labs-zap-search/models/disposition';
import { RECOMMENDATION_OPTIONSET_BY_PARTICIPANT_TYPE_LOOKUP } from 'labs-zap-search/controllers/my-projects/assignment/recommendations/add';

module('Unit | Model | disposition', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', async function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('disposition', {});

    assert.ok(model);
  });

  test('when participant opts out/submits, statuscode becomes "saved"/"submitted"', async function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('disposition', {
      dcpBoroughpresidentrecommendation: null,
      dcpBoroughboardrecommendation: null,
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,
    });

    assert.equal(model.statuscode, STATUSCODES.findBy('Label', 'Draft').Value);

    model.setProperties({
      dcpIspublichearingrequired: 'No',
    });

    assert.equal(model.statuscode, STATUSCODES.findBy('Label', 'Saved').Value);

    model.setProperties({
      dcpBoroughboardrecommendation: RECOMMENDATION_OPTIONSET_BY_PARTICIPANT_TYPE_LOOKUP.BB.findBy('label', 'Favorable').code,
      dcpIspublichearingrequired: 'No',
    });

    assert.equal(model.statuscode, STATUSCODES.findBy('Label', 'Submitted').Value);
  });

  test('when statuscode is draft or saved, statecode is "active"', async function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('disposition', {
      dcpPublichearinglocation: 'foo',
      dcpDateofpublichearing: 'bar',

      dcpBoroughpresidentrecommendation: null,
      dcpBoroughboardrecommendation: null,
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: 'No',
    });

    assert.equal(model.statecode, STATECODES.findBy('Label', 'Active').Value);
  });

  test('when hearing info is submitted, but nothing else, statecode is "active"', async function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('disposition', {
      dcpDateofvote: null,
      dcpBoroughpresidentrecommendation: null,
      dcpBoroughboardrecommendation: null,
      dcpCommunityboardrecommendation: null,
      dcpIspublichearingrequired: null,

      dcpPublichearinglocation: 'foo',
      dcpDateofpublichearing: 'bar',
    });

    assert.equal(model.statuscode, STATUSCODES.findBy('Label', 'Saved').Value);
  });
});
