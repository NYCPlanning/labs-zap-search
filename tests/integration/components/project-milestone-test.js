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
      milestonename: 'Test Milestone',
      dcp_plannedstartdate: '2018-02-28T05:00:00',
      dcp_plannedcompletiondate: '2018-02-28T05:00:00',
      dcp_actualstartdate: null,
      dcp_actualenddate: null,
    });

    await render(hbs`{{project-milestone milestone=milestone}}`);

    assert.equal(this.element.textContent.trim(), `Test Milestone 4 months ago
        February 28, 2018 Planned`);
  });
});
