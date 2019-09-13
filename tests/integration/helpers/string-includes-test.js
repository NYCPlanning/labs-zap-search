import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | string-includes', function(hooks) {
  setupRenderingTest(hooks);

  test('it displays true if substring is in string', async function(assert) {
    this.set('inputString', 'Planning Labs!');
    this.set('inputSubstring', 'Labs');

    await render(hbs`{{string-includes inputString inputSubstring}}`);

    assert.equal(this.element.textContent.trim(), 'true');
  });

  test('it displays false if substring is not in string', async function(assert) {
    this.set('inputString', 'Planning Labs!');
    this.set('inputSubstring', 'Lab Planning');

    await render(hbs`{{string-includes inputString inputSubstring}}`);

    assert.equal(this.element.textContent.trim(), 'false');
  });
});
