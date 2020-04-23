import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | in-array', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it returns true if an element is in the given array', async function(assert) {
    this.set('elem', { actionCode: 'NYC' });
    this.set('arr', [this.elem, { actionCode: 'OR' }]);
    await render(hbs`{{in-array this.arr this.elem}}`);
    assert.equal(this.element.textContent.trim(), 'true');
  });

  test('it returns false if an element is not in the given array', async function(assert) {
    this.set('elem', { actionCode: 'NYC' });
    this.set('arr', [{ actionCode: 'CA' }, { actionCode: 'OR' }]);
    await render(hbs`{{in-array this.arr this.elem}}`);
    assert.equal(this.element.textContent.trim(), 'false');
  });
});
