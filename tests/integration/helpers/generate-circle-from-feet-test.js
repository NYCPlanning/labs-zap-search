import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | generate-circle-from-feet', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    this.set('point', [0, 0]);
    this.set('radius', 400);

    await render(hbs`{{generate-circle-from-feet point radius}}`);

    assert.ok(this.element.textContent);
  });
});
