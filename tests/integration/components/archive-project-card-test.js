import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | archive-project-card', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('project', {});

    await render(hbs`<ArchiveProjectCard @project={{this.project}} />`);

    assert.ok(find('[data-test-project-card]'));
  });
});
