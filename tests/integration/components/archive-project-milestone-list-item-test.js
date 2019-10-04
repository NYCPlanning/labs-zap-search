import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | archive-project-milestone-list-item', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('project', { dispositions: [] });

    this.set('milestone', {});

    await render(hbs`<ArchiveProjectMilestoneListItem @project={{this.project}} @milestone={{this.milestone}}/>`);

    assert.ok(find('[data-test-milestone-list-item]'));
  });
});
