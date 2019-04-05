import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMockBoxHooks from '../../helpers/mapbox-gl-stub';

module('Integration | Component | projects-map-data', function(hooks) {
  setupRenderingTest(hooks);
  setupMockBoxHooks(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{projects-map-data}}`);

    assert.equal(this.element.textContent.trim(), '');
  });
});
