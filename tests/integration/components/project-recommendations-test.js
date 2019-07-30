import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import seedMirage from '../../../mirage/scenarios/default';

module('Integration | Component | project-recommendations', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    this.store = this.owner.lookup('service:store');
    seedMirage(server);
  });

  test('it renders', async function(assert) {
    await render(hbs`<ProjectRecommendations />`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      <ProjectRecommendations>
        template block text
      </ProjectRecommendations>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });


  test('it generates a list of Recommendations', async function(assert) {
    // TODO: Retrieve by email?
    this.user = await this.store.findRecord('user', 2, {
      include: 'userProjectParticipantTypes.project,projects',
    });

    this.project = await this.store.findRecord('project', 3, {
      include: 'actions',
    });

    // User 2, Project 3, has two recommendations because it has two UserProjectParticipantTypes:
    // 'BB' and 'BP'
    await render(hbs`
      <ProjectRecommendations
        @user={{this.user}}
        @project={{this.project}}
        as |recommendations|>
        {{#each recommendations.list as |recommendation|}}
          A recommendation.
        {{/each}}
        {{#each recommendations.participantTypes as |participantType|}}
          {{participantType}}.
        {{/each}}
      </ProjectRecommendations>
    `);

    assert.equal(this.element.textContent.replace(/ /g, '').replace(/(\r\n|\n|\r)/gm, '').trim(), 'Arecommendation.Arecommendation.BB.BP.');
  });
});
