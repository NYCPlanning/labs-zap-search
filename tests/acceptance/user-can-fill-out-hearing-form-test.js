import { module, test } from 'qunit';
import {
  visit,
  currentURL,
  click,
  fillIn,
  triggerKeyEvent,
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

    // user clicks on date input box
    await click('[data-test-hearing-input="date"]');

    // user selects a calendar date
    const hearingDate = new Date('2020-10-21T00:00:00'); // Wednesday, October 21, 2020
    await Pikaday.selectDate(hearingDate);

    // user selects an option from the power-select dropdown
    await selectChoose('.hearing-time-dropdown', '6:30 am');

    // user clicks on submit hearing button
    await click('[data-test-button="hearingSubmit"]');

    // because the user has not input a location yet, there is no transition to another route
    assert.equal(currentURL(), '/my-projects/1/hearing/add');

    // user inputs the hearing address
    await fillIn('.map-search-input', '120 broadway');
    await triggerKeyEvent('.labs-geosearch', 'keypress', 13);

    // user clicks on submit hearing button
    await click('[data-test-button="hearingSubmit"]');

    // because user has input all required fields (date, time, location),
    // clicking on submit hearing button transitions to to-review route
    assert.equal(currentURL(), '/my-projects/to-review');
  });
});
