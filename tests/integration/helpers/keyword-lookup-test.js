import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | keyword-lookup', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it returns the expected keyword', async function(assert) {
    this.set('inputValue', 'RFP');

    await render(hbs`{{keyword-lookup inputValue}}`);

    assert.equal(this.element.textContent.trim(), 'Request for Proposal');
  });
});
