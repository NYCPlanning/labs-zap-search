import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import seedMirage from '../../../mirage/scenarios/default';

module('Integration | Component | participant-types', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    this.store = this.owner.lookup('service:store');
    seedMirage(server);
  });

  test('it generates a list of participantTypes', async function(assert) {
    // TODO: Retrieve by email?
    this.user = await this.store.findRecord('user', 2, {
      include: 'userProjectParticipantTypes.project,projects',
    });

    this.project = await this.store.findRecord('project', 3);

    // User 2, Project 3, has two recommendations because it has two UserProjectParticipantTypes:
    // 'BB' and 'BP'
    await render(hbs`
      <ParticipantTypes
        @project={{this.project}}
        @user={{this.user}}
      as |participantTypes|>
        {{#each participantTypes as |partType|}}
          {{partType}}.
        {{/each}}
      </ParticipantTypes>
    `);

    assert.equal(this.element.textContent.replace(/ /g, '').replace(/(\r\n|\n|\r)/gm, '').trim(), 'BB.BP.');
  });
});
