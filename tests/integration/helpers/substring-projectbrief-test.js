import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | substring-projectbrief', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it shortens long test', async function(assert) {
    this.set('inputValue', new Array(121).toString());

    await render(hbs`{{substring-projectbrief inputValue}}`);

    assert.equal(this.element.textContent.trim().length, 120);
  });
});
