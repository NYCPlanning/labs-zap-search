import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { settled } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import seedMirage from '../../../../../../mirage/scenarios/default';

module('Unit | Controller | my-projects/project/recommendations/add', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    seedMirage(server);
    this.controller = this.owner.lookup('controller:my-projects/project/recommendations/add');
    this.store = this.owner.lookup('service:store');
    this.controller.set('store', this.store);
    const user = await this.store.findRecord('user', 1);
    this.controller.set('recommendation', this.store.createRecord('community-board-recommendation', {
      user,
    }));
    this.controller.transitionToRoute = function() {
      return new Promise((resolve) => { resolve(); });
    };
  });

  test('it exists', function(assert) {
    assert.ok(this.controller);
  });

  test('setProp sets a property', function(assert) {
    assert.equal(this.controller.allActions, true);
    this.controller.send('setProp', 'allActions', false);
    assert.equal(this.controller.allActions, false);
  });

  test('updateRecAttr updates the route Recommendation attribute', function(assert) {
    assert.equal(this.controller.recommendation.voteLocation, '');
    this.controller.send('updateRecAttr', 'voteLocation', 'Oregon');
    assert.equal(this.controller.recommendation.voteLocation, 'Oregon');
  });

  test('addActionToOption adds given action to specified recommendation option', function(assert) {
    const anAction = this.store.createRecord('action');
    assert.equal(this.controller.recommendationOptions.approved.actions.length, 0);
    this.controller.send('addActionToOption', anAction, 'approved');
    assert.equal(this.controller.recommendationOptions.approved.actions.length, 1);
  });

  test('addActionToOption removes given action from all recommendation options except the one specified', function(assert) {
    const anAction = this.store.createRecord('action');
    this.controller.recommendationOptions.disapproved.actions.addObject(anAction);
    assert.equal(this.controller.recommendationOptions.approved.actions.length, 0);
    assert.equal(this.controller.recommendationOptions.disapproved.actions.length, 1);
    this.controller.send('addActionToOption', anAction, 'approved');
    assert.equal(this.controller.recommendationOptions.approved.actions.length, 1);
    assert.equal(this.controller.recommendationOptions.disapproved.actions.length, 0);
  });

  test('submitRecommendation submits one rec for all actions if allActions === true', async function(assert) {
    assert.equal(this.controller.allActions, true);

    // Set up a project with two actions.
    const testAction1 = await this.store.createRecord('action', {
      actionCode: 'OR',
    });
    const testAction2 = await this.store.createRecord('action', {
      actionCode: 'ZZ',
    });
    const testProject = await this.store.createRecord('project');
    testProject.set('actions', [testAction1, testAction2]);
    this.controller.set('model', testProject);

    // ensure store has one unsaved recommendation
    const originalStoreRecommendations = await this.store.findAll('community-board-recommendation');
    assert.equal(originalStoreRecommendations.length, 1);
    assert.equal(originalStoreRecommendations.firstObject.isNew, true);
    assert.equal(this.controller.recommendation.actions.length, 0);
    assert.equal(this.controller.recommendation.isNew, true);

    this.controller.send('submitRecommendation');

    await settled();

    const newStoreRecommendations = await this.store.findAll('community-board-recommendation');
    // ensure controller's recommendation is saved
    assert.equal(originalStoreRecommendations.firstObject.isNew, false);
    assert.equal(this.controller.recommendation.isNew, false);

    // check no extra recommendations were saved to store.
    assert.equal(newStoreRecommendations.length, 1);

    // check saved recommendation has all two actions
    assert.equal(newStoreRecommendations.firstObject.actions.length, 2);
  });

  test('submitRecommendation submits multiple reccs if allActions === false', async function(assert) {
    this.controller.set('allActions', false);
    assert.equal(this.controller.allActions, false);

    const actionOne = this.store.createRecord('action');
    const actionTwo = this.store.createRecord('action');
    this.controller.recommendationOptions.disapproved.actions.addObject(actionOne);
    this.controller.recommendationOptions.get('disapproved-with-modifications-conditions').actions.addObject(actionTwo);
    assert.equal(this.controller.recommendationOptions.disapproved.actions.length, 1);
    assert.equal(this.controller.recommendationOptions.get('disapproved-with-modifications-conditions').actions.length, 1);

    const originalStoreRecommendations = await this.store.findAll('community-board-recommendation');
    assert.equal(originalStoreRecommendations.length, 1);
    assert.equal(originalStoreRecommendations.firstObject.isNew, true);

    this.controller.send('submitRecommendation');

    await settled();

    const newStoreRecommendations = await this.store.findAll('community-board-recommendation');
    // controller's recommendation is not saved because it is cloned when different recommendation options
    // are chosen.
    assert.equal(originalStoreRecommendations.firstObject.isNew, true);
    assert.equal(this.controller.recommendation.isNew, true);
    assert.equal(newStoreRecommendations.firstObject.actions.length, 0);

    // check two recommendations were saved to store.
    assert.equal(newStoreRecommendations.length, 3);
    assert.equal(newStoreRecommendations.arrangedContent[1].isNew(), false);
    assert.equal(newStoreRecommendations.arrangedContent[2].isNew(), false);

    // check each new recommendation has only one action
    newStoreRecommendations.forEach((recommendation, idx) => {
      if (idx > 0) {
        assert.equal(recommendation.actions.length, 1);
      }
    });
  });
});
