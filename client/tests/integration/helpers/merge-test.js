import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | merge', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    this.set('left', { foo: 'bar' });
    this.set('right', { baz: 'qux' });

    await render(hbs`{{merge left right}}`);

    assert.ok(this.element);
  });
});
