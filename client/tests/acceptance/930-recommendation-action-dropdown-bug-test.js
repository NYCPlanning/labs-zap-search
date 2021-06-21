import { module, test } from 'qunit';
import {
  visit,
  click,
  fillIn,
  find,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { selectChoose } from 'ember-power-select/test-support';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { RECOMMENDATION_OPTIONSET_BY_PARTICIPANT_TYPE_LOOKUP } from 'labs-zap-search/controllers/my-projects/assignment/recommendations/add';
import moment from 'moment';
import { participantRoles } from 'labs-zap-search/models/assignment';

module('Acceptance | 930 recommendation action dropdown bug', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Participant can submit a different recommendation for each action', async function(assert) {
    const participantType = 'BP';
    const { label } = participantRoles.findBy('abbreviation', participantType);

    server.create('user', {
      id: 1,
      // These two fields don't matter to these tests
      email: 'qncb5@planning.nyc.gov',
      landUseParticipant: 'QNCB5',
      assignments: [
        server.create('assignment', {
          id: 1,
          tab: 'to-review',
          dcpLupteammemberrole: participantType,
          dispositions: [
            server.create('disposition', {
              dcpRepresenting: label,
              dcpPublichearinglocation: 'Canal street',
              dcpDateofpublichearing: moment().subtract(22, 'days'),
              action: server.create('action'),
            }),
            server.create('disposition', {
              dcpRepresenting: label,
              dcpPublichearinglocation: 'Canal street',
              dcpDateofpublichearing: moment().subtract(22, 'days'),
              action: server.create('action'),
            }),
            server.create('disposition', {
              dcpRepresenting: label,
              dcpPublichearinglocation: 'Hudson Yards',
              dcpDateofpublichearing: moment().subtract(28, 'days'),
              action: server.create('action'),
            }),
          ],
          project: server.create('project', {
            actions: server.schema.actions.all(),
            dispositions: server.schema.dispositions.all(),
          }),
        }),
        server.create('assignment', {
          id: 2,
          tab: 'to-review',
          dcpLupteammemberrole: participantType,
          dispositions: [
            server.create('disposition', {
              id: 5,
              dcpRepresenting: label,
              dcpIspublichearingrequired: 717170001, // No
              dcpPublichearinglocation: null,
              dcpDateofpublichearing: null,
              action: server.create('action'),
            }),
          ],
          project: server.create('project', {
            actions: server.schema.actions.all(),
            dispositions: [server.schema.dispositions.find(5)],
          }),
        }),
      ],
    });

    // rely on the lookup for these
    const firstOption = RECOMMENDATION_OPTIONSET_BY_PARTICIPANT_TYPE_LOOKUP.BP[0];
    const secondOption = RECOMMENDATION_OPTIONSET_BY_PARTICIPANT_TYPE_LOOKUP.BP[1];
    const thirdOption = RECOMMENDATION_OPTIONSET_BY_PARTICIPANT_TYPE_LOOKUP.BP[2];

    await authenticateSession();

    await visit('/my-projects/1/recommendations/add');

    await click('[data-test-quorum-no="0"]');

    await click('[data-test-quorum-yes="1"]');

    await click('[data-test-all-actions-no]');

    await selectChoose('[data-test-each-action-recommendation="0"]', firstOption.label);
    await fillIn('[data-test-each-action-dcpConsideration="0', 'My comment for dcpConsideration 0');

    await selectChoose('[data-test-each-action-recommendation="1"]', secondOption.label);
    await fillIn('[data-test-each-action-dcpConsideration="1', 'My comment for dcpConsideration 1');

    await selectChoose('[data-test-each-action-recommendation="2"]', thirdOption.label);
    await fillIn('[data-test-each-action-dcpConsideration="2', 'My comment for dcpConsideration 2');

    assert.equal(find('[data-test-each-action-recommendation="0"]').textContent.trim(), firstOption.label);
    assert.equal(find('[data-test-each-action-recommendation="1"]').textContent.trim(), secondOption.label);
    assert.equal(find('[data-test-each-action-recommendation="2"]').textContent.trim(), thirdOption.label);

    await click('[data-test-continue]');
    await click('[data-test-submit]');

    // assert transaction
    assert.equal(this.server.db.dispositions[0].dcpBoroughpresidentrecommendation, firstOption.code);
    assert.equal(this.server.db.dispositions[1].dcpBoroughpresidentrecommendation, secondOption.code);
    assert.equal(this.server.db.dispositions[2].dcpBoroughpresidentrecommendation, thirdOption.code);
  });
});
