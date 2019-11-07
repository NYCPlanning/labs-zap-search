import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import EmberObject from '@ember/object';


module('Unit | Controller | my-projects/assignment/recommendations/add', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('clicking on quorum question radio button saves to model', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/assignment/recommendations/add');
    assert.ok(controller);

    // Create 7 disposition objects to put into dispositions array
    const disp = EmberObject.extend({});

    // DISPOSITIONS THAT REPRESENT THE MODEL'S DISPOSITIONS ARRAY (project.dispositions)
    const disp1 = disp.create({
      id: 1,
      dcpWasaquorumpresent: null,
    });

    const disp2 = disp.create({
      id: 2,
      dcpWasaquorumpresent: null,
    });

    const disp3 = disp.create({
      id: 3,
      dcpWasaquorumpresent: null,
    });

    const disp4 = disp.create({
      id: 4,
      dcpWasaquorumpresent: null,
    });

    // represents project.dispositions
    const dispositionsArray = [disp1, disp2, disp3, disp4];

    // DISPOSITIONS THAT REPRESENT THE OBJECTS WITHIN THE dedupedHearings ARRAY
    // a dedupedHearing object that has 3 duplicate dispositions
    const dedupedHearing1 = disp.create({
      id: 1,
      dcpWasaquorumpresent: null,
      duplicateDisps: [
        disp.create({
          id: 1,
          dcpWasaquorumpresent: null,
        }),
        disp.create({
          id: 2,
          dcpWasaquorumpresent: null,
        }),
        disp.create({
          id: 3,
          dcpWasaquorumpresent: null,
        }),
      ],
    });

    // a dedupedHearing object that has 1 duplicate disposition
    const dedupedHearing2 = disp.create({
      id: 4,
      dcpWasaquorumpresent: null,
      duplicateDisps: [
        disp.create({
          id: 4,
          dcpWasaquorumpresent: null,
        }),
      ],
    });

    // set the transitionToRoute action
    controller.transitionToRoute = function(route) {
      assert.equal(route, 'my-projects/assignment/recommendations/done');
    };

    assert.ok(controller.updateDispositionAttr);

    // set dedupedHearing1 to true, corresponding dispositions on the model should be set to same
    controller.updateDispositionAttr(dedupedHearing1, dispositionsArray, 'dcpWasaquorumpresent', true);
    assert.equal(dedupedHearing1.duplicateDisps[0].dcpWasaquorumpresent, true);
    assert.equal(dispositionsArray[0].dcpWasaquorumpresent, true);

    // set dedupedHearing1 to false, corresponing dispositions on the model should be set to same
    controller.updateDispositionAttr(dedupedHearing1, dispositionsArray, 'dcpWasaquorumpresent', false);
    assert.equal(dedupedHearing1.duplicateDisps[0].dcpWasaquorumpresent, false);
    assert.equal(dispositionsArray[0].dcpWasaquorumpresent, false);

    // set dedupedHearing2 to true, corresponding disposition on the model should be set to same
    controller.updateDispositionAttr(dedupedHearing2, dispositionsArray, 'dcpWasaquorumpresent', true);
    assert.equal(dedupedHearing2.duplicateDisps[0].dcpWasaquorumpresent, true);
    assert.equal(dispositionsArray[3].dcpWasaquorumpresent, true);


    // set dedupedHearing2 to false, corresponding disposition on the model should be set to same
    controller.updateDispositionAttr(dedupedHearing2, dispositionsArray, 'dcpWasaquorumpresent', false);
    assert.equal(dedupedHearing2.duplicateDisps[0].dcpWasaquorumpresent, false);
    assert.equal(dispositionsArray[3].dcpWasaquorumpresent, false);
  });

  test('setDispositionChangesetRec sets an "All Actions" changeset recommendation property', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/assignment/recommendations/add');

    assert.ok(controller);

    controller.set('allActions', true);

    controller.set('model', { dcpLupteammemberrole: 'CB' });

    controller.send('setDispositionChangesetRec', controller.dispositionForAllActionsChangeset, { code: 717170002 });

    assert.equal(controller.dispositionForAllActionsChangeset.get('recommendation'), 717170002);
  });

  test('setDispositionChangesetRec sets disposition-specific changeset recommendation property based on participantType', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/assignment/recommendations/add');

    assert.ok(controller);

    controller.set('allActions', false);

    controller.set('model', { dcpLupteammemberrole: 'CB' });

    controller.set('dispositions', server.createList('disposition', 3));
    controller.send('setDispositionChangesetRec', controller.dispositionsChangesets[0], { code: 717170002 });

    assert.equal(controller.dispositionsChangesets[0].get('dcpCommunityboardrecommendation'), 717170002);
    assert.equal(controller.dispositionsChangesets[0].get('dcpBoroughboardrecommendation'), undefined);
    assert.equal(controller.dispositionsChangesets[0].get('dcpBoroughpresidentrecommendation'), undefined);

    controller.set('model', { dcpLupteammemberrole: 'BB' });

    controller.send('setDispositionChangesetRec', controller.dispositionsChangesets[1], { code: 717170000 });

    assert.equal(controller.dispositionsChangesets[1].get('dcpCommunityboardrecommendation'), undefined);
    assert.equal(controller.dispositionsChangesets[1].get('dcpBoroughboardrecommendation'), 717170000);
    assert.equal(controller.dispositionsChangesets[1].get('dcpBoroughpresidentrecommendation'), undefined);

    controller.set('model', { dcpLupteammemberrole: 'BP' });

    controller.send('setDispositionChangesetRec', controller.dispositionsChangesets[2], { code: 717170008 });

    assert.equal(controller.dispositionsChangesets[2].get('dcpCommunityboardrecommendation'), undefined);
    assert.equal(controller.dispositionsChangesets[2].get('dcpBoroughboardrecommendation'), undefined);
    assert.equal(controller.dispositionsChangesets[2].get('dcpBoroughpresidentrecommendation'), 717170008);
  });

  test('if allActions, submitRecommendations persists dispositionForAllActionsChangeset properties to all dispositions', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/assignment/recommendations/add');
    assert.ok(controller);

    controller.transitionToRoute = function() { return true; };

    controller.set('allActions', true);

    controller.set('model', { dcpLupteammemberrole: 'CB' });

    controller.set('dispositions', [EmberObject.create(), EmberObject.create()]);

    controller.dispositions[0].save = function() {
      return true;
    };
    controller.dispositions[1].save = function() {
      return true;
    };

    controller.send('setDispositionChangesetRec', controller.dispositionForAllActionsChangeset, { code: 717170002 });
    controller.dispositionForAllActionsChangeset.set('dcpVotinginfavorrecommendation', 1);
    controller.dispositionForAllActionsChangeset.set('dcpVotingagainstrecommendation', 2);
    controller.dispositionForAllActionsChangeset.set('dcpVotingabstainingonrecommendation', 3);
    controller.dispositionForAllActionsChangeset.set('dcpTotalmembersappointedtotheboard', 4);
    controller.dispositionForAllActionsChangeset.set('dcpVotelocation', 'Atlantic Ave');
    controller.dispositionForAllActionsChangeset.set('dcpDateofvote', '11/11/2019');
    controller.dispositionForAllActionsChangeset.set('dcpConsideration', 'My All Actions Consideration');

    controller.submitRecommendations();

    assert.equal(controller.dispositions[0].dcpCommunityboardrecommendation, 717170002, 'submitRecommendations saved to dcpCommunityboardrecommendation field for dispo 1');
    assert.equal(controller.dispositions[0].dcpVotinginfavorrecommendation, 1, 'submitRecommendations saved to dcpVotinginfavorrecommendation field for dispo 1');
    assert.equal(controller.dispositions[0].dcpVotingagainstrecommendation, 2, 'submitRecommendations saved to dcpVotingagainstrecommendation field for dispo 1');
    assert.equal(controller.dispositions[0].dcpVotingabstainingonrecommendation, 3, 'submitRecommendations saved to dcpVotingabstainingonrecommendation field for dispo 1');
    assert.equal(controller.dispositions[0].dcpTotalmembersappointedtotheboard, 4, 'submitRecommendations saved to dcpTotalmembersappointedtotheboard field for dispo 1');
    assert.equal(controller.dispositions[0].dcpVotelocation, 'Atlantic Ave', 'submitRecommendations saved to dcpVotelocation field for dispo 1');
    assert.equal(controller.dispositions[0].dcpDateofvote, '11/11/2019', 'submitRecommendations saved to dcpDateofvote field for dispo 1');
    assert.equal(controller.dispositions[0].dcpConsideration, 'My All Actions Consideration', 'submitRecommendations saved to dcpConsideration field for dispo 1');

    assert.equal(controller.dispositions[1].dcpCommunityboardrecommendation, 717170002, 'submitRecommendations saved to dcpCommunityboardrecommendation field for dispo 2');
    assert.equal(controller.dispositions[1].dcpVotinginfavorrecommendation, 1, 'submitRecommendations saved to dcpVotinginfavorrecommendation field for dispo 2');
    assert.equal(controller.dispositions[1].dcpVotingagainstrecommendation, 2, 'submitRecommendations saved to dcpVotingagainstrecommendation field for dispo 2');
    assert.equal(controller.dispositions[1].dcpVotingabstainingonrecommendation, 3, 'submitRecommendations saved to dcpVotingabstainingonrecommendation field for dispo 2');
    assert.equal(controller.dispositions[1].dcpTotalmembersappointedtotheboard, 4, 'submitRecommendations saved to dcpTotalmembersappointedtotheboard field for dispo 2');
    assert.equal(controller.dispositions[1].dcpVotelocation, 'Atlantic Ave', 'submitRecommendations saved to dcpVotelocation field for dispo 2');
    assert.equal(controller.dispositions[1].dcpDateofvote, '11/11/2019', 'submitRecommendations saved to dcpDateofvote field for dispo 2');
    assert.equal(controller.dispositions[1].dcpConsideration, 'My All Actions Consideration', 'submitRecommendations saved to dcpConsideration field for dispo 2');
  });

  test('if not allActions, submitRecommendations persists dispositionsChangesets[i] properties to dispositions[i]', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/assignment/recommendations/add');
    assert.ok(controller);

    controller.transitionToRoute = function() { return true; };

    controller.set('allActions', false);

    controller.set('model', { dcpLupteammemberrole: 'CB' });

    controller.set('dispositions', [EmberObject.create(), EmberObject.create()]);

    controller.dispositions[0].save = function() {
      return true;
    };
    controller.dispositions[1].save = function() {
      return true;
    };

    controller.dispositionForAllActionsChangeset.set('dcpVotelocation', 'Atlantic Ave');
    controller.dispositionForAllActionsChangeset.set('dcpDateofvote', '11/11/2019');

    controller.send('setDispositionChangesetRec', controller.dispositionsChangesets[0], { code: 717170002 });
    controller.dispositionsChangesets[0].set('dcpVotinginfavorrecommendation', 1);
    controller.dispositionsChangesets[0].set('dcpVotingagainstrecommendation', 2);
    controller.dispositionsChangesets[0].set('dcpVotingabstainingonrecommendation', 3);
    controller.dispositionsChangesets[0].set('dcpTotalmembersappointedtotheboard', 4);
    controller.dispositionsChangesets[0].set('dcpConsideration', 'My dispositionChangeset 0 Consideration');

    controller.send('setDispositionChangesetRec', controller.dispositionsChangesets[1], { code: 717170008 });
    controller.dispositionsChangesets[1].set('dcpVotinginfavorrecommendation', 4);
    controller.dispositionsChangesets[1].set('dcpVotingagainstrecommendation', 3);
    controller.dispositionsChangesets[1].set('dcpVotingabstainingonrecommendation', 2);
    controller.dispositionsChangesets[1].set('dcpTotalmembersappointedtotheboard', 1);
    controller.dispositionsChangesets[1].set('dcpConsideration', 'My dispositionChangeset 1 Consideration');

    controller.submitRecommendations();

    assert.equal(controller.dispositions[0].dcpCommunityboardrecommendation, 717170002, 'submitRecommendations saved to dcpCommunityboardrecommendation field for dispo 1');
    assert.equal(controller.dispositions[0].dcpVotinginfavorrecommendation, 1, 'submitRecommendations saved to dcpVotinginfavorrecommendation field for dispo 1');
    assert.equal(controller.dispositions[0].dcpVotingagainstrecommendation, 2, 'submitRecommendations saved to dcpVotingagainstrecommendation field for dispo 1');
    assert.equal(controller.dispositions[0].dcpVotingabstainingonrecommendation, 3, 'submitRecommendations saved to dcpVotingabstainingonrecommendation field for dispo 1');
    assert.equal(controller.dispositions[0].dcpTotalmembersappointedtotheboard, 4, 'submitRecommendations saved to dcpTotalmembersappointedtotheboard field for dispo 1');
    assert.equal(controller.dispositions[0].dcpVotelocation, 'Atlantic Ave', 'submitRecommendations saved to dcpVotelocation field for dispo 1');
    assert.equal(controller.dispositions[0].dcpDateofvote, '11/11/2019', 'submitRecommendations saved to dcpDateofvote field for dispo 1');
    assert.equal(controller.dispositions[0].dcpConsideration, 'My dispositionChangeset 0 Consideration', 'submitRecommendations saved to dcpConsideration field for dispo 1');

    assert.equal(controller.dispositions[1].dcpCommunityboardrecommendation, 717170008, 'submitRecommendations saved to dcpCommunityboardrecommendation field for dispo 2');
    assert.equal(controller.dispositions[1].dcpVotinginfavorrecommendation, 4, 'submitRecommendations saved to dcpVotinginfavorrecommendation field for dispo 2');
    assert.equal(controller.dispositions[1].dcpVotingagainstrecommendation, 3, 'submitRecommendations saved to dcpVotingagainstrecommendation field for dispo 2');
    assert.equal(controller.dispositions[1].dcpVotingabstainingonrecommendation, 2, 'submitRecommendations saved to dcpVotingabstainingonrecommendation field for dispo 2');
    assert.equal(controller.dispositions[1].dcpTotalmembersappointedtotheboard, 1, 'submitRecommendations saved to dcpTotalmembersappointedtotheboard field for dispo 2');
    assert.equal(controller.dispositions[1].dcpVotelocation, 'Atlantic Ave', 'submitRecommendations saved to dcpVotelocation field for dispo 2');
    assert.equal(controller.dispositions[1].dcpDateofvote, '11/11/2019', 'submitRecommendations saved to dcpDateofvote field for dispo 2');
    assert.equal(controller.dispositions[1].dcpConsideration, 'My dispositionChangeset 1 Consideration', 'submitRecommendations saved to dcpConsideration field for dispo 2');
  });

  test('statuscode is set to Submitted when user submits recommendation', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/assignment/recommendations/add');
    assert.ok(controller);

    const modelObject = EmberObject.extend({});

    const disp1 = modelObject.create({
      id: 1,
      statuscode: '',
    });

    const disp2 = modelObject.create({
      id: 2,
      statuscode: '',
    });

    const dispositions = [disp1, disp2];

    // set the transitionToRoute action
    controller.transitionToRoute = function(route) {
      assert.equal(route, 'my-projects/assignment/recommendations/done');
    };

    controller.dispositions = dispositions;

    assert.equal(controller.dispositions[0].statuscode, '');
    assert.equal(controller.dispositions[1].statuscode, '');

    assert.ok(controller.submitRecommendations);

    controller.submitRecommendations();
    assert.equal(controller.dispositions[0].statuscode, 'Submitted');
    assert.equal(controller.dispositions[1].statuscode, 'Submitted');
  });
});
