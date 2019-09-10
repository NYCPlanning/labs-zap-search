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

    assert.ok(this.element);
  });
});
