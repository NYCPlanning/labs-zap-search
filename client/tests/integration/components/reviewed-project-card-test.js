import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | reviewed-project-card', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders', async function(assert) {
    this.server.create('assignment', { tab: 'reviewed' }, 'withProject');

    const store = this.owner.lookup('service:store');
    this.assignment = await store.findRecord('assignment', 1, {
      include: 'dispositions,project',
    });

    await render(hbs`<ReviewedProjectCard @assignment={{this.assignment}} />`);

    assert.ok(find('[data-test-project-card]'));
  });
});
