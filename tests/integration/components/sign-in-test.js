import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';

module('Integration | Component | sign-in', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<SignIn />`);

    assert.equal(this.element.textContent.trim(), 'Sign In');
  });

  test('it signs out', async function(assert) {
    this.owner.register('service:session', Service.extend({
      isAuthenticated: true,
      data: {
        authenticated: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJueWNFeHRUT1VWZXJzaW9uIjoiMS4wIiwibWFpbCI6InRlc3RAcGxhbm5pbmcubnljLmdvdiIsInNjb3BlIjpbInphcF9zdGFnaW5nIl0sImdpdmVuTmFtZSI6InRlc3QiLCJueWNFeHRFbWFpbFZhbGlkYXRpb25GbGFnIjp0cnVlLCJHVUlEIjoidGVzdCIsInNuIjoidGVzdCIsInVzZXJUeXBlIjoidGVzdCIsImV4cCI6MTc2NTE2Mzg3OCwianRpIjoidGVzdCJ9.ebw_Vn2dZ5juX1s7FCq5W4SzR4qbcfKYKz_Ep8M7350',
        },
      },
      invalidate() {
        this.set('isAuthenticated', false);
      },
    }));

    await render(hbs`<SignIn />`);

    assert.equal(find('[data-test-auth-name]').textContent.trim(), 'test@planning.nyc.gov');

    await click('[data-test-auth-logout-button]');

    assert.equal(this.element.textContent.trim(), 'Sign In');
  });
});
