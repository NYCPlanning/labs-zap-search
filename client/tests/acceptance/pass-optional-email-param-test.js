import { module, test } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | pass optional email param', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('my projects passes optional email params', async function(assert) {
    await authenticateSession({ access_token: 'test' });
    await visit('/my-projects/to-review?email=test@test.com');

    const [req] = this.server.pretender.handledRequests;

    assert.equal(req.queryParams.email, 'test@test.com');
  });

  test('my projects passes optional email params to upcoming', async function(assert) {
    await authenticateSession({ access_token: 'test' });
    await visit('/my-projects/upcoming?email=test@test.com');

    const [req] = this.server.pretender.handledRequests;

    assert.equal(req.queryParams.email, 'test@test.com');
  });

  test('tab through with param', async function(assert) {
    await authenticateSession({ access_token: 'test' });
    await visit('/my-projects/to-review?email=test@test.com');
    await click('[data-test-tab-button="upcoming"]');

    const [req,, req3] = this.server.pretender.handledRequests;

    assert.equal(req.queryParams.email, 'test@test.com');
    assert.equal(req3.queryParams.email, 'test@test.com');
  });
});
