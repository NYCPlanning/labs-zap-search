import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | lookup-dcp-division', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    this.set('inputValue', 'TRD');

    await render(hbs`{{lookup-dcp-division inputValue}}`);

    assert.equal(this.element.textContent.trim(), 'Technical Review');
  });
});
