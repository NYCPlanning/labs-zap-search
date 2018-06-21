import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | contains-keys', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    this.set('objects', [{ code: 1 }, { code: 2 }]);
    this.set('keys', [1]);
    await render(hbs`
      {{#each (contains-keys objects keys key="code") as |key|}}
        {{key.code}}
      {{/each}}
    `);

    assert.equal(this.element.textContent.trim(), '1');
  });
});
