import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | hearings-list-for-milestones-list', function(hooks) {
  setupRenderingTest(hooks);

  skip('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    // Template block usage:
    await render(hbs`
      <HearingsListForMilestonesList>
        template block text
      </HearingsListForMilestonesList>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
