import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | load-more-button', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{load-more-button}}`);

    assert.equal(this.element.textContent.trim(), 'LOAD MORE');
  });

  test('it disables if noMoreRecords', async function(assert) {
    await render(hbs`{{load-more-button noMoreRecords=true}}`);
    assert.equal(this.element.querySelector('.projects-load-more-button').hasAttribute('disabled'), true);
  });
});
