import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | date-time-picker', function(hooks) {
  setupRenderingTest(hooks);

  test('only date is shown on includeTimeInput=false', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    // Template block usage:
    await render(hbs`
      {{#date-time-picker
        includeTimeInput=false}}
      {{/date-time-picker}}
    `);

    const dateTimePicker = this.element.textContent;
    const dateCorrect = dateTimePicker.includes('Hearing Date');
    const hourCorrect = dateTimePicker.includes('Hour');
    const minuteCorrect = dateTimePicker.includes('Minute');

    assert.ok(dateCorrect);
    assert.notOk(hourCorrect || minuteCorrect);
  });

  test('time inputs are shown on includeTimeInput=true', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    // Template block usage:
    await render(hbs`
      {{#date-time-picker
        includeTimeInput=true}}
      {{/date-time-picker}}
    `);

    const dateTimePicker = this.element.textContent;
    const dateCorrect = dateTimePicker.includes('Hearing Date');
    const hourCorrect = dateTimePicker.includes('Hour');
    const minuteCorrect = dateTimePicker.includes('Minute');

    const timeIncluded = dateCorrect && hourCorrect && minuteCorrect;

    assert.ok(timeIncluded);
  });
});
