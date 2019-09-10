import { module, test } from 'qunit';
import {
  visit,
  click,
  find,
  fillIn,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { Interactor as Pikaday } from 'ember-pikaday/test-support';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { selectChoose } from 'ember-power-select/test-support';
import seedMirage from '../../mirage/scenarios/default';

module('Acceptance | user can save hearing form', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    seedMirage(server);
  });

  test('visiting /user-can-save-hearing-form', async function(assert) {
    this.server.create('project', {
      id: 1,
    });

    await visit('/my-projects/1/hearing/add');

    // user clicks on submit hearing button
    await click('[data-test-button="hearingSubmit"]');

    // because the user has not input a date/time/location yet, the submit button will still appear
    assert.ok(find('[data-test-button="hearingSubmit"]'));

    // user clicks on date input box
    await click('[data-test-hearing-input="date"]');

    // user selects a calendar date
    const hearingDate = new Date('2020-10-21T00:00:00'); // Wednesday, October 21, 2020
    await Pikaday.selectDate(hearingDate);

    // user clicks on submit hearing button
    await click('[data-test-button="hearingSubmit"]');

    // because the user has not input a time yet, the submit button will still appear
    assert.ok(find('[data-test-button="hearingSubmit"]'));

    // user selects an option from the power-select dropdown
    await selectChoose('.hearing-time-dropdown', '6:30 am');

    // user clicks on submit hearing button
    await click('[data-test-button="hearingSubmit"]');

    // because the user has not input a location yet, the submit button will still appear
    assert.ok(find('[data-test-button="hearingSubmit"]'));

    // user inputs the hearing address
    await fillIn('[data-test-hearing-input="location"]', '121 Bananas Ave, Queens, NY');

    // // user clicks on submit hearing button
    await click('[data-test-button="hearingSubmit"]');

    // because user has input all required fields (date, time, location), submit button no longer appears
    assert.notOk(find('[data-test-button="hearingSubmit"]'));

    // make sure that the hearing location equals the input value
    assert.equal(this.element.querySelector('.hearing-location').textContent, '121 Bananas Ave, Queens, NY');
    assert.equal(this.element.querySelector('.hearing-time').textContent, '6:30 AM');
    assert.equal(this.element.querySelector('.hearing-date').textContent, '10/21/2020');
  });
});
