import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | waive-hearings-popup', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    // Template block usage:
    await render(hbs`
      {{#waive-hearings-popup
        showPopup=true}}
      {{/waive-hearings-popup}}
      <div id="reveal-modal-container"></div>
    `);

    const waiveHearingsMessageOnPopup = this.element.textContent.trim();

    const messageVisible = waiveHearingsMessageOnPopup.includes('Are you sure you want to opt out of noticing a public hearing?');

    assert.ok(messageVisible);
  });
});
