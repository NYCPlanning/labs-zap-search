import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | to-review-project-card', function(hooks) {
  setupRenderingTest(hooks);

  test('check that hearings list appears when user has submitted hearings', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    const store = this.owner.lookup('service:store');

    const hearingDate = new Date('2020-10-21T18:30:00');

    const disp1 = store.createRecord('disposition', {
      id: 1,
      dcpPublichearinglocation: '341 Yellow Avenue',
      dcpDateofpublichearing: hearingDate,
      dcpIspublichearingrequired: '',
    });

    const disp2 = store.createRecord('disposition', {
      id: 2,
      dcpPublichearinglocation: '890 Purple Street',
      dcpDateofpublichearing: hearingDate,
      dcpIspublichearingrequired: '',
    });

    const disp3 = store.createRecord('disposition', {
      id: 3,
      dcpPublichearinglocation: '124 Green Boulevard',
      dcpDateofpublichearing: hearingDate,
      dcpIspublichearingrequired: '',
    });

    const assignment = store.createRecord('assignment', {
      id: 1,
      dispositions: [disp1, disp2, disp3],
      dcpLupteammemberrole: 'CB',
      project: store.createRecord('project', {
        id: 2,
      }),
    });

    this.set('assignment', assignment);

    await render(hbs`
      {{#to-review-project-card assignment=assignment}}
      {{/to-review-project-card}}
      <div id="reveal-modal-container"></div>
    `);

    const card = this.element.textContent.trim();

    assert.ok(card.includes('341 Yellow Avenue'));
    assert.ok(card.includes('890 Purple Street'));
    assert.ok(card.includes('124 Green Boulevard'));
  });

  test('check that opt out of hearings BUTTON appears when dcpIspublichearinglocation is empty string', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    const store = this.owner.lookup('service:store');

    const disp1 = store.createRecord('disposition', {
      id: 1,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
      dcpIspublichearingrequired: '',
    });

    const disp2 = store.createRecord('disposition', {
      id: 2,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
      dcpIspublichearingrequired: '',
    });

    const disp3 = store.createRecord('disposition', {
      id: 3,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
      dcpIspublichearingrequired: '',
    });


    const assignment = store.createRecord('assignment', {
      id: 1,
      dispositions: [disp1, disp2, disp3],
      dcpLupteammemberrole: 'CB',
      project: store.createRecord('project', {
        id: 2,
      }),
    });

    this.set('assignment', assignment);

    // Template block usage:
    await render(hbs`
      {{#to-review-project-card assignment=assignment}}
      {{/to-review-project-card}}
      <div id="reveal-modal-container"></div>
    `);

    const card = this.element.textContent.trim();

    assert.ok(card.includes('Post Community Board Hearing Notice'));
    assert.ok(card.includes('Opt Out'));
  });

  test('check that opt out of hearings MESSAGE appears when dcpIspublichearingrequired is No', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    const store = this.owner.lookup('service:store');

    const disp1 = store.createRecord('disposition', {
      id: 1,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
      dcpIspublichearingrequired: 'No',
    });

    const disp2 = store.createRecord('disposition', {
      id: 2,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
      dcpIspublichearingrequired: 'No',
    });

    const disp3 = store.createRecord('disposition', {
      id: 3,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
      dcpIspublichearingrequired: 'No',
    });

    const assignment = store.createRecord('assignment', {
      id: 1,
      dispositions: [disp1, disp2, disp3],
      tab: 'to-review',
      dcpLupteammemberrole: 'CB',
      project: store.createRecord('project', {
        id: 2,
      }),
    });

    this.set('assignment', assignment);

    await render(hbs`
      {{#to-review-project-card assignment=assignment}}
      {{/to-review-project-card}}
      <div id="reveal-modal-container"></div>
    `);

    const card = this.element.textContent.trim();

    assert.ok(card.includes("You've opted out of noticing a public hearing."));
    assert.notOk(card.includes('Opt out'));
    assert.notOk(card.includes('Post Community Board Hearing Notice'));
  });
});
