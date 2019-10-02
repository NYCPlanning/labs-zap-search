import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | reviewed-project-card', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    this.set('project', { reviewedMilestoneActualStartEndDates: [] });

    await render(hbs`{{reviewed-project-card project=this.project}}`);

    assert.ok(find('[data-test-project-card]'));
  });
});
