import {
  module,
  test,
} from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | hearing-form', function(hooks) {
  setupRenderingTest(hooks);

  test('hearing form renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{hearing-form}}`);

    const form = this.element.textContent.trim();

    assert.ok(form.includes('Hearing Location'));
    assert.ok(form.includes('Hearing Date'));
    assert.ok(form.includes('Hour'));
    assert.ok(form.includes('Minute'));
    assert.ok(form.includes('AM/PM'));
  });
});
