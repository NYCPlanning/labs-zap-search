import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Model | user', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  // landUseParticipant that comes back as 'BXBB' will be reassigned to 'BXBP'
  test('participant is reassigned', function(assert) {
    const store = this.owner.lookup('service:store');
    const modelBoroughBoard = store.createRecord('user', { landUseParticipant: 'BXBB' });
    const modelPresident = store.createRecord('user', { landUseParticipant: 'BXBP' });
    const modelCommunityBoard = store.createRecord('user', { landUseParticipant: 'BXCB2' });
    assert.equal(modelBoroughBoard.participant, 'BXBP');
    assert.equal(modelPresident.participant, 'BXBP');
    assert.equal(modelCommunityBoard.participant, 'BXCB2');
  });
});
