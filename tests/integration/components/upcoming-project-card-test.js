import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

module('Integration | Component | upcoming-project-card', function(hooks) {
  setupRenderingTest(hooks);

  test('check that hearings list appears when user has submitted hearings', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    const hearingDate = new Date('2020-10-21T18:30:00');

    const projObject = EmberObject.extend({});

    const dispObject = EmberObject.extend({});

    const disp1 = dispObject.create({
      id: 1,
      dcpPublichearinglocation: '341 Yellow Avenue',
      dcpDateofpublichearing: hearingDate,
    });

    const disp2 = dispObject.create({
      id: 2,
      dcpPublichearinglocation: '890 Purple Street',
      dcpDateofpublichearing: hearingDate,
    });

    const disp3 = dispObject.create({
      id: 3,
      dcpPublichearinglocation: '124 Green Boulevard',
      dcpDateofpublichearing: hearingDate,
    });

    const project = projObject.create({
      id: 1,
      dispositions: [disp1, disp2, disp3],
    });

    this.set('project', project);

    await render(hbs`
      {{#to-review-project-card project=project}}
      {{/to-review-project-card}}
    `);

    const card = this.element.textContent.trim();

    assert.ok(card.includes('341 Yellow Avenue'));
    assert.ok(card.includes('890 Purple Street'));
    assert.ok(card.includes('124 Green Boulevard'));
  });

  test('check that card renders and opt out of hearing BUTTON appears when hearing locations are empty strings', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    const projObject = EmberObject.extend({});

    const dispObject = EmberObject.extend({});

    const disp1 = dispObject.create({
      id: 1,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
    });

    const disp2 = dispObject.create({
      id: 2,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
    });

    const disp3 = dispObject.create({
      id: 3,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
    });


    const project = projObject.create({
      id: 1,
      dispositions: [disp1, disp2, disp3],
    });

    this.set('project', project);

    await render(hbs`
      {{#upcoming-project-card project=project}}
      {{/upcoming-project-card}}
    `);

    const card = this.element.textContent.trim();

    assert.ok(card.includes('Review Begins'));
    assert.ok(card.includes('Opt out of hearings'));
  });

  test('check that card renders and opt out of hearing MESSAGE appears when hearing locations are waived', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    const projObject = EmberObject.extend({});

    const dispObject = EmberObject.extend({});

    const disp1 = dispObject.create({
      id: 1,
      dcpPublichearinglocation: 'waived',
      dcpDateofpublichearing: null,
    });

    const disp2 = dispObject.create({
      id: 2,
      dcpPublichearinglocation: 'waived',
      dcpDateofpublichearing: null,
    });

    const disp3 = dispObject.create({
      id: 3,
      dcpPublichearinglocation: 'waived',
      dcpDateofpublichearing: null,
    });

    const project = projObject.create({
      id: 1,
      dispositions: [disp1, disp2, disp3],
    });

    this.set('project', project);

    await render(hbs`
      {{#upcoming-project-card project=project}}
      {{/upcoming-project-card}}
    `);

    const card = this.element.textContent.trim();

    assert.ok(card.includes('Review Begins'));
    assert.ok(card.includes('You have opted out of submitting hearings'));
    assert.notOk(card.includes('Opt out of hearings'));
  });
});