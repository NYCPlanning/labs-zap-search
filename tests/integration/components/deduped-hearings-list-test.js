import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | deduped-hearings-list', function(hooks) {
  setupRenderingTest(hooks);

  test('deduped-hearings-list is rendered', async function(assert) {
    this.set('ourProject', { dispositions: [] });

    await render(hbs`
      {{deduped-hearings-list project=ourProject attribute="name" hearingsSubmitted=true}}
    `);
    assert.equal(this.element.textContent.trim(), 'Hearing Information');
  });
});
