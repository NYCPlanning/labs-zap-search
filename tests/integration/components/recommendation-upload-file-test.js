import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { upload } from 'ember-file-upload/test-support';

module('Integration | Component | recommendation-upload-file', function(hooks) {
  setupRenderingTest(hooks);

  test('it displays selected files for upload', async function(assert) {
    const file = new File(['Some text'], 'test.txt', { type: 'text/plain' });

    await render(hbs`
      <RecommendationUploadFile/>
    `);

    await upload('#files', file, 'test.txt');

    assert.ok('[data-test-file-name="test.txt"');
  });
});
