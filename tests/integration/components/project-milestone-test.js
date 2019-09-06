import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | project-milestone', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    this.set('milestone', {
      displayName: 'Community Board Review',
    });

    await render(hbs`{{project-milestone milestone=milestone}}`);

    assert.equal(this.element.textContent.trim(), 'Community Board Review');
  });
});
