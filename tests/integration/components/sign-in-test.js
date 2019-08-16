import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { authenticateSession } from 'ember-simple-auth/test-support';
import Service from '@ember/service';

module('Integration | Component | sign-in', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:router', Service.extend({
      transitionTo() {},
    }));
  });

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<SignIn />`);

    assert.equal(this.element.textContent.trim(), 'Sign In');
  });

  test('it signs out', async function(assert) {
    await authenticateSession({
      emailaddress1: 'test@planning.nyc.gov',
    });

    await render(hbs`<SignIn />`);

    assert.equal(find('[data-test-auth-name]').textContent.trim(), 'test@planning.nyc.gov');

    await click('[data-test-auth-logout-button]');

    assert.equal(this.element.textContent.trim(), 'Sign In');
  });
});
