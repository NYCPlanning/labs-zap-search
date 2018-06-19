import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | build-url', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    this.set('inputType', 'zola');
    this.set('bbl', '0123456789');

    await render(hbs`{{build-url inputType bbl}}`);

    assert.equal(this.element.textContent.trim(), 'https://zola.planning.nyc.gov/lot/0/12345/6789');
  });
});
