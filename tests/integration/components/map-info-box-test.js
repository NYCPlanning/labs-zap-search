import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | map-info-box', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{map-info-box}}`);

    assert.equal(this.element.textContent.trim().replace(/\s/g, ''), 'PrefiledFiledInPublicReviewCompletedDisclaimer');

    // Template block usage:
    await render(hbs`
      {{#map-info-box}}
        template block text
      {{/map-info-box}}
    `);

    assert.equal(this.element.textContent.trim().replace(/\s/g, ''), 'PrefiledFiledInPublicReviewCompletedDisclaimertemplateblocktext');
  });
});
