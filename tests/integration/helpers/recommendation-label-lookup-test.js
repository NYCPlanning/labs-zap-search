import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | recommendation-label-lookup', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    this.set('code', 717170000);
    await render(hbs`{{recommendation-label-lookup 'CB' code}}`);

    assert.equal(this.element.textContent.trim(), 'Approved');
  });
});
