import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | structural/project-list-map', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    this.set('bounds', [1,1]);
    this.set('center', [1,1]);
    this.set('zoom', 14);

    await render(hbs`{{structural/project-list-map zoom=1 bounds=bounds mapCenter=center}}`);

    assert.equal(this.element.textContent.trim(), 'Missing Mapbox GL JS CSS');
  });
});
