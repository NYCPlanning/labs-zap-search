import { module, test } from 'qunit';
import {
  visit,
  click,
  currentURL,
  find,
  fillIn,
  triggerEvent,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { Interactor as Pikaday } from 'ember-pikaday/test-support';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { selectChoose } from 'ember-power-select/test-support';
import { invalidateSession, authenticateSession } from 'ember-simple-auth/test-support';
import seedMirage from '../../mirage/scenarios/default';

module('Acceptance | user can save hearing form', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    window.location.hash = '';

    await invalidateSession();
  });

  hooks.afterEach(async function() {
    window.location.hash = '';

    await invalidateSession();
  });

  hooks.beforeEach(async function() {
    // TODO: Remove this dependency on default Mirage scenario if it becomes too much overhead
    // to update these tests to align with them.
    seedMirage(server);

    await authenticateSession();
  });

  test('user cannot submit hearing form until all inputs are filled for AllActions', async function(assert) {
    await visit('/my-projects/4/hearing/add');

    // make sure that the submit button is not showing up until a user selects a radio button
    assert.notOk(find('[data-test-button="checkHearing"]'));

    // user selects radio button for a SINGLE hearing for ALL actions
    await click('[data-test-radio="all-action-yes"]');

    // now that a user has selected radio button, checkHearing button should show up
    assert.ok(find('[data-test-button="checkHearing"]'));

    // user fills in a location input
    await fillIn('[data-test-allactions-input="location"]', '121 Bananas Ave, Queens, NY');

    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="location"]', 'keyup', {
      keyCode: 84, // t
    });

    // make sure that clicking the checkHearing button does not open the modal
    // not all inputs are present
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // user clicks on date input box
    await click('[data-test-allactions-input="date"]');

    // user selects a calendar date
    const hearingDate = new Date('2020-10-21T00:00:00'); // Wednesday, October 21, 2020
    await Pikaday.selectDate(hearingDate);

    // make sure that clicking the checkHearing button does not open the modal
    // not all inputs are present
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    await fillIn('[data-test-allactions-input="hour"]', 6);

    // make sure that clicking the checkHearing button does not open the modal
    // not all inputs are present
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    await fillIn('[data-test-allactions-input="minute"]', 30);

    // make sure that clicking the checkHearing button does not open the modal
    // not all inputs are present
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // user selects an option from the power-select dropdown
    await selectChoose('[data-test-allactions-dropdown="timeOfDay"]', 'PM');

    // clicking on checkHearing button should open modal
    await click('[data-test-button="checkHearing"]');

    // check that confirmHearing button in modal is present
    assert.ok(find('[data-test-button="confirmHearing"]'));

    // make sure that the hearing location in the modal equals the input value
    assert.equal(this.element.querySelector('.hearing-location').textContent, '121 Bananas Ave, Queens, NY');
    assert.equal(this.element.querySelector('.hearing-time').textContent, '6:30 PM');
    assert.equal(this.element.querySelector('.hearing-date').textContent, '10/21/2020');

    await click('[data-test-button="confirmHearing"]');

    assert.equal(currentURL(), '/my-projects/4/hearing/done');
  });

  test('user cannot submit hearing form until all inputs are filled for ONE action per hearing', async function(assert) {
    await visit('/my-projects/4/hearing/add');

    // make sure that the submit button is not showing up until a user selects a radio button
    assert.notOk(find('[data-test-button="checkHearing"]'));

    // user selects radio button for one action per hearing
    await click('[data-test-radio="all-action-no"]');

    // now that a user has selected radio button, checkHearing button should show up
    assert.ok(find('[data-test-button="checkHearing"]'));

    // ## DISPOSITION 1 #######################################################
    await fillIn('[data-test-location-input="22"]', '121 Bananas Ave, Queens, NY');
    await triggerEvent('[data-test-location-input="22"]', 'keyup');
    // user clicks on date input box
    await click('[data-test-date-input="22"]');
    await Pikaday.selectDate(new Date('2020-10-21T00:00:00'));
    await fillIn('[data-test-hour-input="22"]', 6);
    await fillIn('[data-test-minute-input="22"]', 30);
    await selectChoose('[data-test-timeofday-dropdown="22"] .timeofday-dropdown', 'PM');

    // assert that user cannot submit hearing form yet
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // ## DISPOSITION 2 #######################################################
    await fillIn('[data-test-location-input="23"]', '121 Bananas Ave, Queens, NY');
    await triggerEvent('[data-test-location-input="23"]', 'keyup');
    await click('[data-test-date-input="23"]');
    await Pikaday.selectDate(new Date('2020-10-21T00:00:00'));
    await fillIn('[data-test-hour-input="23"]', 6);
    await fillIn('[data-test-minute-input="23"]', 30);
    await selectChoose('[data-test-timeofday-dropdown="23"] .timeofday-dropdown', 'PM');

    // assert that user cannot submit hearing form yet
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // ## DISPOSITION 3 #######################################################
    await fillIn('[data-test-location-input="24"]', '186 Alligators Ave, Staten Island, NY');
    await triggerEvent('[data-test-location-input="24"]', 'keyup');
    await click('[data-test-date-input="24"]');
    await Pikaday.selectDate(new Date('2020-11-12T00:00:00'));
    await fillIn('[data-test-hour-input="24"]', 5);
    await fillIn('[data-test-minute-input="24"]', 45);
    await selectChoose('[data-test-timeofday-dropdown="24"] .timeofday-dropdown', 'PM');

    // assert that user cannot submit hearing form yet
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // ## DISPOSITION 4 #######################################################
    await fillIn('[data-test-location-input="25"]', '144 Piranha Ave, Manhattan, NY');
    await triggerEvent('[data-test-location-input="25"]', 'keyup');
    // user clicks on date input b
    await click('[data-test-date-input="25"]');
    await Pikaday.selectDate(new Date('2020-11-12T00:00:00'));
    await fillIn('[data-test-hour-input="25"]', 5);
    await fillIn('[data-test-minute-input="25"]', 45);
    // user selects an option from the power-select dropdown
    await selectChoose('[data-test-timeofday-dropdown="25"] .timeofday-dropdown', 'AM');

    // assert that user cannot submit hearing form yet
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // ## DISPOSITION 5 #######################################################
    await fillIn('[data-test-location-input="26"]', '121 Bananas Ave, Queens, NY');
    await triggerEvent('[data-test-location-input="26"]', 'keyup');
    await click('[data-test-date-input="26"]');
    await Pikaday.selectDate(new Date('2020-10-21T00:00:00'));
    await fillIn('[data-test-hour-input="26"]', 6);
    await fillIn('[data-test-minute-input="26"]', 30);
    await selectChoose('[data-test-timeofday-dropdown="26"] .timeofday-dropdown', 'PM');

    // assert that user cannot submit hearing form yet
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // ## DISPOSITION 6 #######################################################
    await fillIn('[data-test-location-input="27"]', '456 Crocodiles Ave, Bronx, NY');
    await triggerEvent('[data-test-location-input="27"]', 'keyup', {
      keyCode: 84, // t
    });
    await click('[data-test-date-input="27"]');
    await Pikaday.selectDate(new Date('2020-10-21T00:00:00'));
    await fillIn('[data-test-hour-input="27"]', 6);
    await fillIn('[data-test-minute-input="27"]', 30);
    await selectChoose('[data-test-timeofday-dropdown="27"] .timeofday-dropdown', 'PM');

    // assert that user cannot submit hearing form yet
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // ## DISPOSITION 7 #######################################################
    await fillIn('[data-test-location-input="28"]', '121 Bananas Ave, Queens, NY');
    await triggerEvent('[data-test-location-input="28"]', 'keyup');
    await click('[data-test-date-input="28"]');
    await Pikaday.selectDate(new Date('2020-10-21T00:00:00'));
    await fillIn('[data-test-hour-input="28"]', 1);
    await fillIn('[data-test-minute-input="28"]', 25);
    await selectChoose('[data-test-timeofday-dropdown="28"] .timeofday-dropdown', 'AM');

    // clicking on checkHearing button should open modal for user to review hearing input
    await click('[data-test-button="checkHearing"]');

    // #####################################################################################################
    // ######## Creating variables for checking if hearings list shows up correctly #########################
    // assert that list of hearings text shows up correctly
    const location22 = this.element.querySelector('[data-test-hearing-location="22"]').textContent;
    const time22 = this.element.querySelector('[data-test-hearing-time="22"]').textContent;
    const date22 = this.element.querySelector('[data-test-hearing-date="22"]').textContent;
    const location28 = this.element.querySelector('[data-test-hearing-location="28"]').textContent;
    const time28 = this.element.querySelector('[data-test-hearing-time="28"]').textContent;
    const date28 = this.element.querySelector('[data-test-hearing-date="28"]').textContent;
    // there will be three actions associated with hearing 22-- since hearing 22, 23, and 25 were duplicates
    const action22 = this.element.querySelector('[data-test-hearing-actions-list="22"]').textContent;
    const action23 = this.element.querySelector('[data-test-hearing-actions-list="22"]').textContent;
    const action25 = this.element.querySelector('[data-test-hearing-actions-list="22"]').textContent;
    // hearing 28 has the same location and date as hearing 22, but a differen time
    const action28 = this.element.querySelector('[data-test-hearing-actions-list="28"]').textContent;

    // check that the hearing text content is correct
    const location22Correct = location22 === '121 Bananas Ave, Queens, NY';
    const time22Correct = time22 === '6:30 PM';
    const date22Correct = date22 === '10/21/2020';
    const location28Correct = location28 === '121 Bananas Ave, Queens, NY';
    const time28Correct = time28 === '1:25 AM';
    const date28Correct = date28 === '10/21/2020';
    // sometimes the ulurp number is displayed, whereas sometimes the action name is displayed
    const action22Correct = action22.includes('C780076TLK') || action22.includes('Zoning Special Permit');
    const action23Correct = action23.includes('N860877TCM') || action23.includes('Zoning Text Amendment');
    const action25Correct = action25.includes('190172ZMK') || action25.includes('Enclosed Sidewalk Cafe');
    const action28Correct = action28.includes('190256ZMK') || action28.includes('Zoning Certification');

    // variables to check all hearing and actions text at once
    const hearingInfo = location22Correct && date22Correct && time22Correct && location28Correct && date28Correct && time28Correct;
    const actionsInfo = action22Correct && action23Correct && action25Correct && action28Correct;

    // ##################################################################################################################

    // assert that hearing info in modal is correct
    assert.ok(hearingInfo);
    assert.ok(actionsInfo);

    // officially saves the hearing info to the model
    await click('[data-test-button="confirmHearing"]');

    assert.equal(currentURL(), '/my-projects/4/hearing/done');

    // clicking back to to-review
    await click('[data-test-button="back-to-review"]');

    assert.ok(hearingInfo);
    assert.ok(actionsInfo);

    // make sure that project 5 does not have a hearings list
    assert.notOk(find('[data-test-hearing-location="29"]'));
  });

  test('user cannot submit hearing form if hour or minute contain invalid values', async function(assert) {
    await visit('/my-projects/4/hearing/add');

    // user selects radio button for a SINGLE hearing for ALL actions
    await click('[data-test-radio="all-action-yes"]');

    // user fills in a location input
    await fillIn('[data-test-allactions-input="location"]', '121 Bananas Ave, Queens, NY');

    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="location"]', 'keyup');

    // user clicks on date input box
    await click('[data-test-allactions-input="date"]');

    // user selects a calendar date
    const hearingDate = new Date('2020-10-21T00:00:00'); // Wednesday, October 21, 2020
    await Pikaday.selectDate(hearingDate);

    // #### both HOUR and MINUTE are invalid
    await fillIn('[data-test-allactions-input="hour"]', 23);
    await fillIn('[data-test-allactions-input="minute"]', 102);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="hour"]', 'keyup');

    // user selects an option from the power-select dropdown
    await selectChoose('[data-test-allactions-dropdown="timeOfDay"]', 'AM');

    // assert that user cannot submit hearing form yet
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // #### MINUTE is invalid
    await fillIn('[data-test-allactions-input="hour"]', 5);
    await fillIn('[data-test-allactions-input="minute"]', 102);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="hour"]', 'keyup');

    // assert that user cannot submit hearing form yet
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // #### HOUR is invalid
    await fillIn('[data-test-allactions-input="hour"]', 23);
    await fillIn('[data-test-allactions-input="minute"]', 35);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="hour"]', 'keyup');

    // assert that user cannot submit hearing form yet
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // #### both are valid
    await fillIn('[data-test-allactions-input="hour"]', 5);
    await fillIn('[data-test-allactions-input="minute"]', 35);

    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="hour"]', 'keyup');

    // clicking on checkHearing button should open modal
    await click('[data-test-button="checkHearing"]');

    // check that confirmHearing button in modal is present
    assert.ok(find('[data-test-button="confirmHearing"]'));

    // make sure that the hearing location in the modal equals the input value
    assert.equal(this.element.querySelector('.hearing-location').textContent, '121 Bananas Ave, Queens, NY');
    assert.equal(this.element.querySelector('.hearing-time').textContent, '5:35 AM');
    assert.equal(this.element.querySelector('.hearing-date').textContent, '10/21/2020');

    await click('[data-test-button="confirmHearing"]');

    assert.equal(currentURL(), '/my-projects/4/hearing/done');
  });
});
