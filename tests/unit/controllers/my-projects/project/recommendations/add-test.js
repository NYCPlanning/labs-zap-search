import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import EmberObject from '@ember/object';


module('Unit | Controller | my-projects/project/recommendations/add', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('clicking on quorum question radio button saves to model', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/project/recommendations/add');
    assert.ok(controller);

    // Create 7 disposition objects to put into dispositions array
    const disp = EmberObject.extend({});

    // DISPOSITIONS THAT REPRESENT THE MODEL'S DISPOSITIONS ARRAY (project.dispositions)
    const disp1 = disp.create({
      id: 1,
      wasaquorumpresent: null,
    });

    const disp2 = disp.create({
      id: 2,
      wasaquorumpresent: null,
    });

    const disp3 = disp.create({
      id: 3,
      wasaquorumpresent: null,
    });

    const disp4 = disp.create({
      id: 4,
      wasaquorumpresent: null,
    });

    // represents project.dispositions
    const dispositionsArray = [disp1, disp2, disp3, disp4];

    // DISPOSITIONS THAT REPRESENT THE OBJECTS WITHIN THE dedupedHearings ARRAY
    // a dedupedHearing object that has 3 duplicate dispositions
    const dedupedHearing1 = disp.create({
      id: 1,
      wasaquorumpresent: null,
      duplicateDisps: [
        disp.create({
          id: 1,
          wasaquorumpresent: null,
        }),
        disp.create({
          id: 2,
          wasaquorumpresent: null,
        }),
        disp.create({
          id: 3,
          wasaquorumpresent: null,
        }),
      ],
    });

    // a dedupedHearing object that has 1 duplicate disposition
    const dedupedHearing2 = disp.create({
      id: 4,
      wasaquorumpresent: null,
      duplicateDisps: [
        disp.create({
          id: 4,
          wasaquorumpresent: null,
        }),
      ],
    });

    // set the transitionToRoute action
    controller.transitionToRoute = function(route) {
      assert.equal(route, 'my-projects/project/recommendations/done');
    };

    assert.ok(controller.updateDispositionAttr);

    // set dedupedHearing1 to true, corresponding dispositions on the model should be set to same
    controller.updateDispositionAttr(dedupedHearing1, dispositionsArray, 'wasaquorumpresent', true);
    assert.equal(dedupedHearing1.duplicateDisps[0].wasaquorumpresent, true);
    assert.equal(dispositionsArray[0].wasaquorumpresent, true);

    // set dedupedHearing1 to false, corresponing dispositions on the model should be set to same
    controller.updateDispositionAttr(dedupedHearing1, dispositionsArray, 'wasaquorumpresent', false);
    assert.equal(dedupedHearing1.duplicateDisps[0].wasaquorumpresent, false);
    assert.equal(dispositionsArray[0].wasaquorumpresent, false);

    // set dedupedHearing2 to true, corresponding disposition on the model should be set to same
    controller.updateDispositionAttr(dedupedHearing2, dispositionsArray, 'wasaquorumpresent', true);
    assert.equal(dedupedHearing2.duplicateDisps[0].wasaquorumpresent, true);
    assert.equal(dispositionsArray[3].wasaquorumpresent, true);


    // set dedupedHearing2 to false, corresponding disposition on the model should be set to same
    controller.updateDispositionAttr(dedupedHearing2, dispositionsArray, 'wasaquorumpresent', false);
    assert.equal(dedupedHearing2.duplicateDisps[0].wasaquorumpresent, false);
    assert.equal(dispositionsArray[3].wasaquorumpresent, false);
  });

  test('setDispositionRec sets an "All Actions" changeset recommendation property', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/project/recommendations/add');
    assert.ok(controller);

    controller.set('allActions', true);

    controller.set('participantType', 'CB');

    controller.send('setDispositionRec', controller.dispositionForAllActionsChangeset, 'Disapproved');

    assert.equal(controller.dispositionForAllActionsChangeset.get('recommendation'), 'Disapproved');
  });

  test('setDispositionRec sets disposition-specific changeset recommendation property based on participantType', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/project/recommendations/add');
    assert.ok(controller);

    controller.set('allActions', false);

    controller.set('participantType', 'CB');

    controller.set('dispositions', server.createList('disposition', 3));
    controller.send('setDispositionRec', controller.dispositionsChangesets[0], 'Disapproved');

    assert.equal(controller.dispositionsChangesets[0].get('communityboardrecommendation'), 'Disapproved');
    assert.equal(controller.dispositionsChangesets[0].get('boroughboardrecommendation'), undefined);
    assert.equal(controller.dispositionsChangesets[0].get('boroughpresidentrecommendation'), undefined);

    controller.set('participantType', 'BB');

    controller.send('setDispositionRec', controller.dispositionsChangesets[1], 'Approved');

    assert.equal(controller.dispositionsChangesets[1].get('communityboardrecommendation'), undefined);
    assert.equal(controller.dispositionsChangesets[1].get('boroughboardrecommendation'), 'Approved');
    assert.equal(controller.dispositionsChangesets[1].get('boroughpresidentrecommendation'), undefined);

    controller.set('participantType', 'BP');

    controller.send('setDispositionRec', controller.dispositionsChangesets[2], 'Waived');

    assert.equal(controller.dispositionsChangesets[2].get('communityboardrecommendation'), undefined);
    assert.equal(controller.dispositionsChangesets[2].get('boroughboardrecommendation'), undefined);
    assert.equal(controller.dispositionsChangesets[2].get('boroughpresidentrecommendation'), 'Waived');
  });

  test('if allActions, submitRecommendations persists dispositionForAllActionsChangeset properties to all dispositions', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/project/recommendations/add');
    assert.ok(controller);

    controller.transitionToRoute = function() { return true; };

    controller.set('allActions', true);

    controller.set('participantType', 'CB');

    controller.set('dispositions', [EmberObject.create(), EmberObject.create()]);

    controller.dispositions[0].save = function() {
      return true;
    };
    controller.dispositions[1].save = function() {
      return true;
    };

    controller.send('setDispositionRec', controller.dispositionForAllActionsChangeset, 'Disapproved');
    controller.dispositionForAllActionsChangeset.set('votinginfavorrecommendation', 1);
    controller.dispositionForAllActionsChangeset.set('votingagainstrecommendation', 2);
    controller.dispositionForAllActionsChangeset.set('votingabstainingonrecommendation', 3);
    controller.dispositionForAllActionsChangeset.set('totalmembersappointedtotheboard', 4);
    controller.dispositionForAllActionsChangeset.set('votelocation', 'Atlantic Ave');
    controller.dispositionForAllActionsChangeset.set('dateofvote', '11/11/2019');
    controller.dispositionForAllActionsChangeset.set('consideration', 'My All Actions Consideration');

    controller.submitRecommendations();

    assert.equal(controller.dispositions[0].votinginfavorrecommendation, 1, 'setDispositionRec saved to votinginfavorrecommendation field for dispo 1');
    assert.equal(controller.dispositions[0].votingagainstrecommendation, 2, 'setDispositionRec saved to votingagainstrecommendation field for dispo 1');
    assert.equal(controller.dispositions[0].votingabstainingonrecommendation, 3, 'setDispositionRec saved to votingabstainingonrecommendation field for dispo 1');
    assert.equal(controller.dispositions[0].totalmembersappointedtotheboard, 4, 'setDispositionRec saved to totalmembersappointedtotheboard field for dispo 1');
    assert.equal(controller.dispositions[0].votelocation, 'Atlantic Ave', 'setDispositionRec saved to votelocation field for dispo 1');
    assert.equal(controller.dispositions[0].dateofvote, '11/11/2019', 'setDispositionRec saved to dateofvote field for dispo 1');
    assert.equal(controller.dispositions[0].consideration, 'My All Actions Consideration', 'setDispositionRec saved to consideration field for dispo 1');

    assert.equal(controller.dispositions[1].votinginfavorrecommendation, 1, 'setDispositionRec saved to votinginfavorrecommendation field for dispo 2');
    assert.equal(controller.dispositions[1].votingagainstrecommendation, 2, 'setDispositionRec saved to votingagainstrecommendation field for dispo 2');
    assert.equal(controller.dispositions[1].votingabstainingonrecommendation, 3, 'setDispositionRec saved to votingabstainingonrecommendation field for dispo 2');
    assert.equal(controller.dispositions[1].totalmembersappointedtotheboard, 4, 'setDispositionRec saved to totalmembersappointedtotheboard field for dispo 2');
    assert.equal(controller.dispositions[1].votelocation, 'Atlantic Ave', 'setDispositionRec saved to votelocation field for dispo 2');
    assert.equal(controller.dispositions[1].dateofvote, '11/11/2019', 'setDispositionRec saved to dateofvote field for dispo 2');
    assert.equal(controller.dispositions[1].consideration, 'My All Actions Consideration', 'setDispositionRec saved to consideration field for dispo 2');
  });

  test('if not allActions, submitRecommendations persists dispositionsChangesets[i] properties to dispositions[i]', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/project/recommendations/add');
    assert.ok(controller);

    controller.transitionToRoute = function() { return true; };

    controller.set('allActions', false);

    controller.set('participantType', 'CB');

    controller.set('dispositions', [EmberObject.create(), EmberObject.create()]);

    controller.dispositions[0].save = function() {
      return true;
    };
    controller.dispositions[1].save = function() {
      return true;
    };

    controller.dispositionForAllActionsChangeset.set('votelocation', 'Atlantic Ave');
    controller.dispositionForAllActionsChangeset.set('dateofvote', '11/11/2019');

    controller.dispositionsChangesets[0].set('votinginfavorrecommendation', 1);
    controller.dispositionsChangesets[0].set('votingagainstrecommendation', 2);
    controller.dispositionsChangesets[0].set('votingabstainingonrecommendation', 3);
    controller.dispositionsChangesets[0].set('totalmembersappointedtotheboard', 4);
    controller.dispositionsChangesets[0].set('consideration', 'My dispositionChangeset 0 Consideration');

    controller.dispositionsChangesets[1].set('votinginfavorrecommendation', 4);
    controller.dispositionsChangesets[1].set('votingagainstrecommendation', 3);
    controller.dispositionsChangesets[1].set('votingabstainingonrecommendation', 2);
    controller.dispositionsChangesets[1].set('totalmembersappointedtotheboard', 1);
    controller.dispositionsChangesets[1].set('consideration', 'My dispositionChangeset 1 Consideration');

    controller.submitRecommendations();

    assert.equal(controller.dispositions[0].votinginfavorrecommendation, 1, 'setDispositionRec saved to votinginfavorrecommendation field for dispo 1');
    assert.equal(controller.dispositions[0].votingagainstrecommendation, 2, 'setDispositionRec saved to votingagainstrecommendation field for dispo 1');
    assert.equal(controller.dispositions[0].votingabstainingonrecommendation, 3, 'setDispositionRec saved to votingabstainingonrecommendation field for dispo 1');
    assert.equal(controller.dispositions[0].totalmembersappointedtotheboard, 4, 'setDispositionRec saved to totalmembersappointedtotheboard field for dispo 1');
    assert.equal(controller.dispositions[0].votelocation, 'Atlantic Ave', 'setDispositionRec saved to votelocation field for dispo 1');
    assert.equal(controller.dispositions[0].dateofvote, '11/11/2019', 'setDispositionRec saved to dateofvote field for dispo 1');
    assert.equal(controller.dispositions[0].consideration, 'My dispositionChangeset 0 Consideration', 'setDispositionRec saved to consideration field for dispo 1');

    assert.equal(controller.dispositions[1].votinginfavorrecommendation, 4, 'setDispositionRec saved to votinginfavorrecommendation field for dispo 2');
    assert.equal(controller.dispositions[1].votingagainstrecommendation, 3, 'setDispositionRec saved to votingagainstrecommendation field for dispo 2');
    assert.equal(controller.dispositions[1].votingabstainingonrecommendation, 2, 'setDispositionRec saved to votingabstainingonrecommendation field for dispo 2');
    assert.equal(controller.dispositions[1].totalmembersappointedtotheboard, 1, 'setDispositionRec saved to totalmembersappointedtotheboard field for dispo 2');
    assert.equal(controller.dispositions[1].votelocation, 'Atlantic Ave', 'setDispositionRec saved to votelocation field for dispo 2');
    assert.equal(controller.dispositions[1].dateofvote, '11/11/2019', 'setDispositionRec saved to dateofvote field for dispo 2');
    assert.equal(controller.dispositions[1].consideration, 'My dispositionChangeset 1 Consideration', 'setDispositionRec saved to consideration field for dispo 2');
  });
});
