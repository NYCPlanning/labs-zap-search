import { module, test } from 'qunit';
import { visit, currentURL, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | 876 applicant name shows', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visit a project with a single applicant name', async function(assert) {
    this.server.create('project', {
      id: 1,
      applicantteam: [{
        name: 'Foo'
      }],
    });

    await visit('/projects/1');

    assert.equal(
      find('[data-test-project-property="applicantteam"]').textContent.trim(),
      `Applicant:
                  Foo`,
    );
  });

  test('visit a project with muliple applicant names', async function(assert) {
    this.server.create('project', {
      id: 1,
      applicantteam: [
        { name: 'Foo', role: 'Baz' },
        { name: 'Bar', role: 'Qux' },
      ],
    });

    await visit('/projects/1');

    assert.equal(
      find('[data-test-project-property="applicantteam"]').textContent.trim(),
      `Applicant Team:
                  
                  Foo
                  (Baz)
                  
                  Bar
                  (Qux)`,
    );
  });
});
