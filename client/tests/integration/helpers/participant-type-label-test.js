import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | participant-type-label', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{participant-type-label "CB"}}`);

    assert.equal(this.element.textContent.trim(), 'Community Board');

    await render(hbs`{{participant-type-label "BB"}}`);

    assert.equal(this.element.textContent.trim(), 'Borough Board');

    await render(hbs`{{participant-type-label "BP"}}`);

    assert.equal(this.element.textContent.trim(), 'Borough President');
  });
});
