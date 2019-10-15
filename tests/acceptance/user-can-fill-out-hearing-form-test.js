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
    await authenticateSession();
  });

  test('user cannot submit hearing form until all inputs are filled for AllActions', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      project: this.server.create('project', {
        id: 4,
        dispositions: this.server.createList('dispositions', 2, { tab: 'to-review' }),
      }),
    });

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
    this.server.create('assignment', {
      id: 5,
      project: this.server.create('project', {
        dispositions: [
          server.create('disposition', {
            id: 17,
            action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 18,
            action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
          }),
          server.create('disposition', {
            id: 19,
            action: server.create('action', { dcpName: 'Business Improvement District', dcpUlurpnumber: 'I030148MMQ' }),
          }),
          server.create('disposition', {
            id: 20,
            action: server.create('action', { dcpName: 'Change in City Map', dcpUlurpnumber: '200088ZMX' }),
          }),
          server.create('disposition', {
            id: 21,
            action: server.create('action', { dcpName: 'Enclosed Sidewalk Cafe', dcpUlurpnumber: '190172ZMK' }),
          }),
          server.create('disposition', {
            id: 22,
            action: server.create('action', { dcpName: 'Large Scale Special Permit', dcpUlurpnumber: 'N190257ZRK' }),
          }),
          server.create('disposition', {
            id: 23,
            action: server.create('action', { dcpName: 'Zoning Certification', dcpUlurpnumber: '190256ZMK' }),
          }),
        ],
      }),
    });

    await visit('/my-projects/5/hearing/add');

    // make sure that the submit button is not showing up until a user selects a radio button
    assert.notOk(find('[data-test-button="checkHearing"]'));

    // user selects radio button for one action per hearing
    await click('[data-test-radio="all-action-no"]');

    // now that a user has selected radio button, checkHearing button should show up
    assert.ok(find('[data-test-button="checkHearing"]'));

    // ## DISPOSITION 1 #######################################################
    await fillIn('[data-test-location-input="17"]', '121 Bananas Ave, Queens, NY');
    await triggerEvent('[data-test-location-input="17"]', 'keyup');
    // user clicks on date input box
    await click('[data-test-date-input="17"]');
    await Pikaday.selectDate(new Date('2020-10-21T00:00:00'));
    await fillIn('[data-test-hour-input="17"]', 6);
    await fillIn('[data-test-minute-input="17"]', 30);
    await selectChoose('[data-test-timeofday-dropdown="17"] .timeofday-dropdown', 'PM');

    // assert that user cannot submit hearing form yet
    await click('[data-test-button="checkHearing"]');

    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // ## DISPOSITION 2 #######################################################
    await fillIn('[data-test-location-input="18"]', '121 Bananas Ave, Queens, NY');
    await triggerEvent('[data-test-location-input="18"]', 'keyup');
    await click('[data-test-date-input="18"]');
    await Pikaday.selectDate(new Date('2020-10-21T00:00:00'));
    await fillIn('[data-test-hour-input="18"]', 6);
    await fillIn('[data-test-minute-input="18"]', 30);
    await selectChoose('[data-test-timeofday-dropdown="18"] .timeofday-dropdown', 'PM');

    // assert that user cannot submit hearing form yet
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // ## DISPOSITION 3 #######################################################
    await fillIn('[data-test-location-input="19"]', '186 Alligators Ave, Staten Island, NY');
    await triggerEvent('[data-test-location-input="19"]', 'keyup');
    await click('[data-test-date-input="19"]');
    await Pikaday.selectDate(new Date('2020-11-12T00:00:00'));
    await fillIn('[data-test-hour-input="19"]', 5);
    await fillIn('[data-test-minute-input="19"]', 45);
    await selectChoose('[data-test-timeofday-dropdown="19"] .timeofday-dropdown', 'PM');

    // assert that user cannot submit hearing form yet
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // ## DISPOSITION 4 #######################################################
    await fillIn('[data-test-location-input="20"]', '144 Piranha Ave, Manhattan, NY');
    await triggerEvent('[data-test-location-input="20"]', 'keyup');
    // user clicks on date input b
    await click('[data-test-date-input="20"]');
    await Pikaday.selectDate(new Date('2020-11-12T00:00:00'));
    await fillIn('[data-test-hour-input="20"]', 5);
    await fillIn('[data-test-minute-input="20"]', 45);
    // user selects an option from the power-select dropdown
    await selectChoose('[data-test-timeofday-dropdown="20"] .timeofday-dropdown', 'AM');

    // assert that user cannot submit hearing form yet
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // ## DISPOSITION 5 #######################################################
    await fillIn('[data-test-location-input="21"]', '121 Bananas Ave, Queens, NY');
    await triggerEvent('[data-test-location-input="21"]', 'keyup');
    await click('[data-test-date-input="21"]');
    await Pikaday.selectDate(new Date('2020-10-21T00:00:00'));
    await fillIn('[data-test-hour-input="21"]', 6);
    await fillIn('[data-test-minute-input="21"]', 30);
    await selectChoose('[data-test-timeofday-dropdown="21"] .timeofday-dropdown', 'PM');

    // assert that user cannot submit hearing form yet
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // ## DISPOSITION 6 #######################################################
    await fillIn('[data-test-location-input="22"]', '456 Crocodiles Ave, Bronx, NY');
    await triggerEvent('[data-test-location-input="22"]', 'keyup', {
      keyCode: 84, // t
    });
    await click('[data-test-date-input="22"]');
    await Pikaday.selectDate(new Date('2020-10-21T00:00:00'));
    await fillIn('[data-test-hour-input="22"]', 6);
    await fillIn('[data-test-minute-input="22"]', 30);
    await selectChoose('[data-test-timeofday-dropdown="22"] .timeofday-dropdown', 'PM');

    // assert that user cannot submit hearing form yet
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // ## DISPOSITION 7 #######################################################
    await fillIn('[data-test-location-input="23"]', '121 Bananas Ave, Queens, NY');
    await triggerEvent('[data-test-location-input="23"]', 'keyup');
    await click('[data-test-date-input="23"]');
    await Pikaday.selectDate(new Date('2020-10-21T00:00:00'));
    await fillIn('[data-test-hour-input="23"]', 1);
    await fillIn('[data-test-minute-input="23"]', 25);
    await selectChoose('[data-test-timeofday-dropdown="23"] .timeofday-dropdown', 'AM');

    // clicking on checkHearing button should open modal for user to review hearing input
    await click('[data-test-button="checkHearing"]');

    // #####################################################################################################
    // ######## Creating variables for checking if hearings list shows up correctly #########################
    // assert that list of hearings text shows up correctly
    const location17 = this.element.querySelector('[data-test-hearing-location="17"]').textContent;
    const time17 = this.element.querySelector('[data-test-hearing-time="17"]').textContent;
    const date17 = this.element.querySelector('[data-test-hearing-date="17"]').textContent;
    const location23 = this.element.querySelector('[data-test-hearing-location="23"]').textContent;
    const time23 = this.element.querySelector('[data-test-hearing-time="23"]').textContent;
    const date23 = this.element.querySelector('[data-test-hearing-date="23"]').textContent;
    // there will be three actions associated with hearing 22-- since hearing 17, 18, 21 were duplicates
    const action17 = this.element.querySelector('[data-test-hearing-actions-list="17"]').textContent;
    const action18 = this.element.querySelector('[data-test-hearing-actions-list="17"]').textContent;
    const action21 = this.element.querySelector('[data-test-hearing-actions-list="17"]').textContent;
    // hearing 23 has the same location and date as hearing 22, but a differen time
    const action23 = this.element.querySelector('[data-test-hearing-actions-list="23"]').textContent;

    // check that the hearing text content is correct
    assert.equal(location17, '121 Bananas Ave, Queens, NY', "correct text for data-test-hearing-location='17'");
    assert.equal(time17, '6:30 PM', "correct text for data-test-hearing-time='17'");
    assert.equal(date17, '10/21/2020', "correct text for data-test-hearing-date='17'");
    assert.equal(location23, '121 Bananas Ave, Queens, NY', "correct text for data-test-hearing-location='23'");
    assert.equal(time23, '1:25 AM', "correct text for data-test-hearing-time='23'");
    assert.equal(date23, '10/21/2020', "correct text for data-test-hearing-date='23'");
    // sometimes the ulurp number is displayed, whereas sometimes the action name is displayed
    assert.ok(action17.includes('C780076TLK') || action17.includes('Zoning Special Permit'), 'action17 includes correct ulurp info');
    assert.ok(action18.includes('N860877TCM') || action17.includes('Zoning Text Amendment'), 'action17 includes correct ulurp info');
    assert.ok(action21.includes('190172ZMK') || action17.includes('Enclosed Sidewalk Cafe'), 'action17 includes correct ulurp info');

    assert.ok(action23.includes('190256ZMK') || action23.includes('Zoning Certification'), 'action23 includes correct ulurp info');

    // ##################################################################################################################


    // officially saves the hearing info to the model
    await click('[data-test-button="confirmHearing"]');

    assert.equal(currentURL(), '/my-projects/5/hearing/done');

    // clicking back to to-review
    await click('[data-test-button="back-to-review"]');

    // make sure that project 6 does not have a hearings list
    assert.notOk(find('[data-test-hearing-location="24"]'));
  });

  test('user cannot submit hearing form if hour or minute contain invalid values', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      project: this.server.create('project', {
        id: 4,
        dispositions: this.server.createList('dispositions', 2, { tab: 'to-review' }),
      }),
    });

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

  test('if there is a server error when running .save(), user will see error message', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      project: this.server.create('project', {
        id: 4,
        dispositions: this.server.createList('dispositions', 1, {
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
        }),
      }),
    });

    this.server.patch('/dispositions/:id', { errors: ['server problem'] }, 500); // force mirage to error

    await visit('/my-projects/4/hearing/add');

    // user selects radio button for a SINGLE hearing for ALL actions
    await click('[data-test-radio="all-action-yes"]');

    await fillIn('[data-test-allactions-input="location"]', '121 Bananas Ave, Queens, NY');

    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="location"]', 'keyup');

    await click('[data-test-allactions-input="date"]');

    const hearingDate = new Date('2020-10-21T00:00:00'); // Wednesday, October 21, 2020
    await Pikaday.selectDate(hearingDate);

    await selectChoose('[data-test-allactions-dropdown="timeOfDay"]', 'AM');
    await fillIn('[data-test-allactions-input="hour"]', 5);
    await fillIn('[data-test-allactions-input="minute"]', 35);

    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="hour"]', 'keyup');

    await click('[data-test-button="checkHearing"]');

    await click('[data-test-button="confirmHearing"]');

    assert.ok(find('[data-test-error-alert-message]'));
  });
});
