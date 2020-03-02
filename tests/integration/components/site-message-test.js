import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | site-message', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<SiteMessage />`);
    assert.equal(this.element.textContent.trim(), '');

    await render(hbs`
      {{site-message message="template block text"}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
