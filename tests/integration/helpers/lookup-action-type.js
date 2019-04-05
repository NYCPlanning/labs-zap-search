import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | lookup-action-type', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it returns the expected action type', async function(assert) {
    this.set('inputValue', 'ZM');

    await render(hbs`{{lookup-action-type inputValue}}`);

    assert.equal(this.element.textContent.trim(), '(ULURP) A Zoning Map Amendment is a change in designation or a change in district boundaries for any zoning district on the New York City Zoning Map.  Zoning Map Amendments are discretionary actions subject to the Uniform Land Use Review Procedure.');
  });
});
