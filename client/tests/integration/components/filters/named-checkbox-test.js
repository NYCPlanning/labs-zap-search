import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | filters/named-checkbox', function(hooks) {
  setupRenderingTest(hooks);

  test('it displays the label', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`
      {{filters/named-checkbox
        label='The Label'
        mainProperty=true
      }}
    `);

    assert.equal(this.element.textContent.trim(), 'The Label');
  });
});
