import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | upcoming-project-card', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('check that card renders and opt out of hearing BUTTON appears when hearing locations are empty strings', async function(assert) {
    this.server.create('assignment', {
      tab: 'upcoming',
      dispositions: [
        this.server.create('disposition', {
          id: 1,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
        }),
        this.server.create('disposition', {
          id: 2,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
        }),
        this.server.create('disposition', {
          id: 3,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
        }),
      ],
      project: this.server.create('project', {
        dispositions: this.server.schema.dispositions.all(),
      }),
    });

    const store = this.owner.lookup('service:store');
    this.assignment = await store.findRecord('assignment', 1, {
      include: 'dispositions,project,project.dispositions',
    });

    await render(hbs`
      {{#upcoming-project-card assignment=assignment}}
      {{/upcoming-project-card}}
      <div id="reveal-modal-container"></div>
    `);

    const card = this.element.textContent.trim();

    assert.ok(card.includes('Review Begins'));
    assert.ok(card.includes('Opt Out'));
  });
});
