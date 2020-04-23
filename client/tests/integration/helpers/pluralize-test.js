import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | pluralize', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it uses singular', async function(assert) {
    this.count = 1;
    this.singular = 'project';
    this.plural = 'projects';

    await render(hbs`{{pluralize count 'project' 'projects'}}`);

    assert.equal(this.element.textContent.trim(), 'project');
  });

  test('it uses plural', async function (assert) {
    this.count = 100;
    this.singular = 'project';
    this.plural = 'projects';

    await render(hbs`{{pluralize count 'project' 'projects'}}`);

    assert.equal(this.element.textContent.trim(), 'projects');
  });
});
