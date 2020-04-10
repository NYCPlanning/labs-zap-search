import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | confirmation-modal', function(hooks) {
  setupRenderingTest(hooks);

  test('the confirmation modal has a close button', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    // Template block usage:
    await render(hbs`
      {{#confirmation-modal open=true}}
        template block text
      {{/confirmation-modal}}
    `);

    assert.equal(this.element.querySelector('.close-button').hasAttribute('aria-label'), true);
  });
});
