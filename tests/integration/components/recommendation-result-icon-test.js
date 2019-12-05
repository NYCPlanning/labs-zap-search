import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | recommendation-result-icon', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders correct icon for a recommendation', async function(assert) {
    await render(hbs`<RecommendationResultIcon @recommendation="Approved"/>`);

    assert.ok(find('[data-icon="thumbs-up"]'));

    await render(hbs`<RecommendationResultIcon @recommendation="Disapproved"/>`);

    assert.ok(find('[data-icon="thumbs-down"]'));

    await render(hbs`<RecommendationResultIcon @recommendation="Waiver of Recommendation"/>`);

    assert.ok(find('[data-icon="comment-slash"]'));
  });
});
