import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | lookup-community-district', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it provides lookup data', async function(assert) {
    this.set('inputValue', '1234');

    await render(hbs`{{lookup-community-district}}`);

    assert.ok(this.element.textContent);
  });
});
