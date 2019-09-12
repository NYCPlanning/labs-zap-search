import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | rec-field-by-parttype-lookup', function(hooks) {
  setupRenderingTest(hooks);

  test('it returns right recommendation field for CB partType', async function(assert) {
    this.set('participantType', 'CB');

    await render(hbs`{{rec-field-by-parttype-lookup participantType}}`);

    assert.equal(this.element.textContent.trim(), 'communityboardrecommendation');
  });

  test('it returns right recommendation field for BP partType', async function(assert) {
    this.set('participantType', 'BP');

    await render(hbs`{{rec-field-by-parttype-lookup participantType}}`);

    assert.equal(this.element.textContent.trim(), 'boroughpresidentrecommendation');
  });

  test('it returns right recommendation field for BB partType', async function(assert) {
    this.set('participantType', 'BB');

    await render(hbs`{{rec-field-by-parttype-lookup participantType}}`);

    assert.equal(this.element.textContent.trim(), 'boroughboardrecommendation');
  });

  test('it has an undefined return value for invalid partType', async function(assert) {
    this.set('participantType', 'AA');

    await render(hbs`{{rec-field-by-parttype-lookup participantType}}`);

    assert.equal(this.element.textContent.trim(), '');
  });
});
