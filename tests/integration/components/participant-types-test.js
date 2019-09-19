import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Integration | Component | participant-types', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    this.store = this.owner.lookup('service:store');
  });

  test('it generates a list of participantTypes', async function(assert) {
    this.user = {
      projects: [{
        userProjectParticipantTypes: [{
          participantType: 'BB',
        },
        {
          participantType: 'BP',
        }],
      }],
    };

    this.project = {};

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
