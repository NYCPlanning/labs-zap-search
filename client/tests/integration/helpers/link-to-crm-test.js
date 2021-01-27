import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | link-to-crm', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    this.set('type', 'dcp_project');
    this.set('id', '1234');

    await render(hbs`{{link-to-crm type id}}`);

    assert.equal(this.element.textContent.trim(), 'https://nycdcppfs.crm9.dynamics.com/main.aspx?etn=dcp_project&id={1234}&pagetype=entityrecord');
  });
});
