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

module('Acceptance | user can fill out hearing form', function(hooks) {
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
      tab: 'to-review',
      dispositions: [
        server.create('disposition', {
          id: 1,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectactionValue: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
          // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
        server.create('disposition', {
          id: 2,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectactionValue: '9bbfbec7-2407-ea11-a9aa-001dd8308025',
          // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        }),
      ],
      project: this.server.create('project', {
        id: 4,
        actions: [
          server.create('action', { id: '32a6b44c-8c0c-ea11-a9a8-001dd830804f', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          server.create('action', { id: '9bbfbec7-2407-ea11-a9aa-001dd8308025', dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        ],
        dispositions: [
          server.create('disposition', {
            id: 1,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectactionValue: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
            // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 2,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectactionValue: '9bbfbec7-2407-ea11-a9aa-001dd8308025',
            // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
          }),
        ],
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
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="hour"]', 'keyup');

    // make sure that clicking the checkHearing button does not open the modal
    // not all inputs are present
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    await fillIn('[data-test-allactions-input="minute"]', 30);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="minute"]', 'keyup');

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
      tab: 'to-review',
      dispositions: [
        server.create('disposition', {
          id: 17,
          // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          dcpProjectactionValue: '1',
        }),
        server.create('disposition', {
          id: 18,
          // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
          dcpProjectactionValue: '2',
        }),
        server.create('disposition', {
          id: 19,
          // action: server.create('action', { dcpName: 'Business Improvement District', dcpUlurpnumber: 'I030148MMQ' }),
          dcpProjectactionValue: '3',
        }),
        server.create('disposition', {
          id: 20,
          // action: server.create('action', { dcpName: 'Change in City Map', dcpUlurpnumber: '200088ZMX' }),
          dcpProjectactionValue: '4',
        }),
        server.create('disposition', {
          id: 21,
          // action: server.create('action', { dcpName: 'Enclosed Sidewalk Cafe', dcpUlurpnumber: '190172ZMK' }),
          dcpProjectactionValue: '5',
        }),
        server.create('disposition', {
          id: 22,
          // action: server.create('action', { dcpName: 'Large Scale Special Permit', dcpUlurpnumber: 'N190257ZRK' }),
          dcpProjectactionValue: '6',
        }),
        server.create('disposition', {
          id: 23,
          // action: server.create('action', { dcpName: 'Zoning Certification', dcpUlurpnumber: '190256ZMK' }),
          dcpProjectactionValue: '7',
        }),
      ],
      project: this.server.create('project', {
        actions: [
          server.create('action', { id: '1', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          server.create('action', { id: '2', dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
          server.create('action', { id: '3', dcpName: 'Business Improvement District', dcpUlurpnumber: 'I030148MMQ' }),
          server.create('action', { id: '4', dcpName: 'Change in City Map', dcpUlurpnumber: '200088ZMX' }),
          server.create('action', { id: '5', dcpName: 'Enclosed Sidewalk Cafe', dcpUlurpnumber: '190172ZMK' }),
          server.create('action', { id: '6', dcpName: 'Large Scale Special Permit', dcpUlurpnumber: 'N190257ZRK' }),
          server.create('action', { id: '7', dcpName: 'Zoning Certification', dcpUlurpnumber: '190256ZMK' }),
        ],
        dispositions: [
          server.create('disposition', {
            id: 17,
            // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
            dcpProjectactionValue: '1',
          }),
          server.create('disposition', {
            id: 18,
            // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
            dcpProjectactionValue: '2',
          }),
          server.create('disposition', {
            id: 19,
            // action: server.create('action', { dcpName: 'Business Improvement District', dcpUlurpnumber: 'I030148MMQ' }),
            dcpProjectactionValue: '3',
          }),
          server.create('disposition', {
            id: 20,
            // action: server.create('action', { dcpName: 'Change in City Map', dcpUlurpnumber: '200088ZMX' }),
            dcpProjectactionValue: '4',
          }),
          server.create('disposition', {
            id: 21,
            // action: server.create('action', { dcpName: 'Enclosed Sidewalk Cafe', dcpUlurpnumber: '190172ZMK' }),
            dcpProjectactionValue: '5',
          }),
          server.create('disposition', {
            id: 22,
            // action: server.create('action', { dcpName: 'Large Scale Special Permit', dcpUlurpnumber: 'N190257ZRK' }),
            dcpProjectactionValue: '6',
          }),
          server.create('disposition', {
            id: 23,
            // action: server.create('action', { dcpName: 'Zoning Certification', dcpUlurpnumber: '190256ZMK' }),
            dcpProjectactionValue: '7',
          }),
        ],
      }),
    });

    this.server.create('assignment', {
      id: 6,
      dispositions: [
        server.create('disposition', {
          id: 24,
          dcpProjectactionValue: '1',
          // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C1009383' }),
        }),
      ],
      project: this.server.create('project', {
        actions: [
          server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C1009383' }),
        ],
        dispositions: [
          server.create('disposition', {
            id: 24,
            dcpProjectactionValue: '1',
            // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C1009383' }),
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

    // ## DISPOSITION 1 ################### duplicate with Disposition 2 & 5
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

    // ## DISPOSITION 2 ################### duplicate with Disposition 1 & 5
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
    await Pikaday.selectDate(new Date('2021-11-12T00:00:00'));
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

    // ## DISPOSITION 5 ################### duplicate with Disposition 1 & 2
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

    // make sure that project 6 does not have a hearings list
    assert.notOk(find('[data-test-hearing-location="24"]'));
  });

  test('user cannot submit hearing form if hour or minute contain invalid values', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      tab: 'to-review',
      dispositions: [
        server.create('disposition', {
          id: 1,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectactionValue: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
          // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
        server.create('disposition', {
          id: 2,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectactionValue: '9bbfbec7-2407-ea11-a9aa-001dd8308025',
          // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        }),
      ],
      project: this.server.create('project', {
        id: 4,
        actions: [
          server.create('action', { id: '32a6b44c-8c0c-ea11-a9a8-001dd830804f', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          server.create('action', { id: '9bbfbec7-2407-ea11-a9aa-001dd8308025', dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        ],
        dispositions: [
          server.create('disposition', {
            id: 1,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectactionValue: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
            // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 2,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectactionValue: '9bbfbec7-2407-ea11-a9aa-001dd8308025',
            // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
          }),
        ],
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
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="hour"]', 'keyup');

    await fillIn('[data-test-allactions-input="minute"]', 102);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="minute"]', 'keyup');

    // user selects an option from the power-select dropdown
    await selectChoose('[data-test-allactions-dropdown="timeOfDay"]', 'AM');

    // assert that user cannot submit hearing form yet
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // #### MINUTE is invalid
    await fillIn('[data-test-allactions-input="hour"]', 5);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="hour"]', 'keyup');

    await fillIn('[data-test-allactions-input="minute"]', 102);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="minute"]', 'keyup');

    // assert that user cannot submit hearing form yet
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // #### HOUR is invalid
    await fillIn('[data-test-allactions-input="hour"]', 23);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="hour"]', 'keyup');

    await fillIn('[data-test-allactions-input="minute"]', 35);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="minute"]', 'keyup');

    // assert that user cannot submit hearing form yet
    await click('[data-test-button="checkHearing"]');
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // #### both are valid
    await fillIn('[data-test-allactions-input="hour"]', 5);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="hour"]', 'keyup');

    await fillIn('[data-test-allactions-input="minute"]', 35);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="minute"]', 'keyup');

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

  test('users not prompted with allActions question if there is only one disposition', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      tab: 'to-review',
      dispositions: [
        server.create('disposition', {
          id: 17,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectactionValue: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
          // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
      ],
      project: this.server.create('project', {
        id: 4,
        actions: [
          server.create('action', { id: '32a6b44c-8c0c-ea11-a9a8-001dd830804f', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        ],
        dispositions: [
          server.create('disposition', {
            id: 17,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectactionValue: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
            // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
        ],
      }),
    });

    await visit('/my-projects/4/hearing/add');

    assert.notOk(find('[data-test-radio="all-action-yes"]'));
    assert.notOk(find('[data-test-radio="all-action-no"]'));

    // user fills in a location input
    await fillIn('[data-test-allactions-input="location"]', '121 Bananas Ave, Queens, NY');

    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="location"]', 'keyup', {
      keyCode: 84, // t
    });

    // user clicks on date input box
    await click('[data-test-allactions-input="date"]');
    // user selects a calendar date
    const hearingDate = new Date('2020-10-21T00:00:00'); // Wednesday, October 21, 2020
    await Pikaday.selectDate(hearingDate);

    await fillIn('[data-test-allactions-input="hour"]', 6);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="hour"]', 'keyup');

    await fillIn('[data-test-allactions-input="minute"]', 30);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="minute"]', 'keyup');

    // user selects an option from the power-select dropdown
    await selectChoose('[data-test-allactions-dropdown="timeOfDay"]', 'PM');

    await click('[data-test-button="checkHearing"]');

    // make sure that the hearing location in the modal equals the input value
    assert.equal(this.element.querySelector('.hearing-location').textContent, '121 Bananas Ave, Queens, NY');
    assert.equal(this.element.querySelector('.hearing-time').textContent, '6:30 PM');
    assert.equal(this.element.querySelector('.hearing-date').textContent, '10/21/2020');

    await click('[data-test-button="confirmHearing"]');

    assert.equal(currentURL(), '/my-projects/4/hearing/done');

    // clicking back to to-review
    await click('[data-test-button="back-to-review"]');

    assert.equal(this.element.querySelector('[data-test-hearing-location="17"]').textContent, '121 Bananas Ave, Queens, NY');
    assert.ok(this.element.querySelector('[data-test-hearing-date="17"]').textContent.includes('10/21/2020'));
    assert.ok(this.element.querySelector('[data-test-hearing-time="17"]').textContent.includes('6:30 PM'));
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="17"]').textContent.includes('Zoning Special Permit'));
  });

  test('if there is a server error when running .save(), user will see error message', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      tab: 'to-review',
      dispositions: [
        server.create('disposition', {
          id: 1,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectactionValue: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
          // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
        server.create('disposition', {
          id: 2,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectactionValue: '9bbfbec7-2407-ea11-a9aa-001dd8308025',
          // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        }),
      ],
      project: this.server.create('project', {
        id: 4,
        actions: [
          server.create('action', { id: '32a6b44c-8c0c-ea11-a9a8-001dd830804f', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          server.create('action', { id: '9bbfbec7-2407-ea11-a9aa-001dd8308025', dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        ],
        dispositions: [
          server.create('disposition', {
            id: 1,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectactionValue: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
            // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 2,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectactionValue: '9bbfbec7-2407-ea11-a9aa-001dd8308025',
            // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
          }),
        ],
      }),
    });

    this.server.patch('/dispositions/:id', { errors: [{ message: 'server problem' }] }, 500); // force mirage to error

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
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="hour"]', 'keyup');

    await fillIn('[data-test-allactions-input="minute"]', 35);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="minute"]', 'keyup');

    await click('[data-test-button="checkHearing"]');

    await click('[data-test-button="confirmHearing"]');

    this.server.patch('/dispositions/:id');

    assert.ok(find('[data-test-error-alert-message]'));

    await click('[data-test-button="backToHearingFormAfterError"]');

    await click('[data-test-button="checkHearing"]');

    await click('[data-test-button="confirmHearing"]');

    assert.equal(currentURL(), '/my-projects/4/hearing/done');
  });

  test('single disposition hearing form with NULL dcpDateofpublichearing works, triggers modal', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      tab: 'to-review',
      dispositions: [
        server.create('disposition', {
          id: 1,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectactionValue: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
          // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
      ],
      project: this.server.create('project', {
        id: 4,
        actions: [
          server.create('action', { id: '32a6b44c-8c0c-ea11-a9a8-001dd830804f', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        ],
        dispositions: [
          server.create('disposition', {
            id: 1,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectactionValue: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
            // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
        ],
      }),
    });

    await visit('/my-projects/4/hearing/add');

    assert.notOk(find('[data-test-radio="all-action-yes"]'));
    assert.notOk(find('[data-test-radio="all-action-no"]'));

    // user fills in a location input
    await fillIn('[data-test-allactions-input="location"]', '121 Bananas Ave, Queens, NY');

    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="location"]', 'keyup', {
      keyCode: 84, // t
    });

    // user clicks on date input box
    await click('[data-test-allactions-input="date"]');
    // user selects a calendar date
    const hearingDate = new Date('2020-10-21T00:00:00'); // Wednesday, October 21, 2020
    await Pikaday.selectDate(hearingDate);

    await fillIn('[data-test-allactions-input="hour"]', 6);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="hour"]', 'keyup');

    await fillIn('[data-test-allactions-input="minute"]', 30);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="minute"]', 'keyup');

    // user selects an option from the power-select dropdown
    await selectChoose('[data-test-allactions-dropdown="timeOfDay"]', 'PM');

    await click('[data-test-button="checkHearing"]');

    await click('[data-test-button="confirmHearing"]');

    assert.equal(currentURL(), '/my-projects/4/hearing/done');
  });

  test('user can submit hearing on upcoming tab', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      tab: 'upcoming',
      dispositions: [
        server.create('disposition', {
          id: 1,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectactionValue: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
          // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
        server.create('disposition', {
          id: 2,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectactionValue: '9bbfbec7-2407-ea11-a9aa-001dd8308025',
          // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        }),
      ],
      project: this.server.create('project', {
        id: 4,
        actions: [
          server.create('action', { id: '32a6b44c-8c0c-ea11-a9a8-001dd830804f', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          server.create('action', { id: '9bbfbec7-2407-ea11-a9aa-001dd8308025', dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        ],
        dispositions: [
          server.create('disposition', {
            id: 1,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectactionValue: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
            // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 2,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectactionValue: '9bbfbec7-2407-ea11-a9aa-001dd8308025',
            // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
          }),
        ],
      }),
    });

    await visit('/my-projects/upcoming');

    await click('[data-test-button-post-hearing="4"]');

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
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="hour"]', 'keyup');

    await fillIn('[data-test-allactions-input="minute"]', 35);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="minute"]', 'keyup');

    await click('[data-test-button="checkHearing"]');

    await click('[data-test-button="confirmHearing"]');

    assert.equal(currentURL(), '/my-projects/4/hearing/done');

    await click('[data-test-button="back-to-review"]');

    await click('[data-test-tab-button="upcoming"]');

    assert.equal(currentURL(), '/my-projects/upcoming');

    assert.equal(this.element.querySelector('[data-test-hearing-location="1"]').textContent, '121 Bananas Ave, Queens, NY');
    assert.ok(this.element.querySelector('[data-test-hearing-date="1"]').textContent.includes('10/21/2020'));
    assert.ok(this.element.querySelector('[data-test-hearing-time="1"]').textContent.includes('5:35 AM'));
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="1"]').textContent.includes('Zoning Special Permit'));
    assert.ok(this.element.querySelector('[data-test-hearing-actions-list="1"]').textContent.includes('Zoning Text Amendment'));
  });

  test('button for UPCOMING hearing submission does not show if there are no dispositions', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      tab: 'upcoming',
      dispositions: [],
      project: this.server.create('project', {
        id: 31,
        actions: [
          server.create('action', { id: '32a6b44c-8c0c-ea11-a9a8-001dd830804f', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        ],
        dispositions: [],
      }),
    });

    this.server.create('assignment', {
      id: 5,
      tab: 'upcoming',
      dispositions: [
        server.create('disposition', {
          id: 1,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectactionValue: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
          // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
      ],
      project: this.server.create('project', {
        id: 30,
        actions: [
          server.create('action', { id: '32a6b44c-8c0c-ea11-a9a8-001dd830804f', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        ],
        dispositions: [
          server.create('disposition', {
            id: 1,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectactionValue: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
            // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
        ],
      }),
    });

    await visit('/my-projects/upcoming');

    // ############ ASSIGNMENT 4 ################################################
    // Assignment 4 DOES NOT have dispositions, so hearing buttons should be disabled

    // button should display, but should be disabled
    assert.ok(find('[data-test-button-post-hearing="4"]'));

    // clicking on the post hearing button should NOT change the route
    await click('[data-test-button-post-hearing="4"]');

    assert.equal(currentURL(), '/my-projects/upcoming');

    // clicking on the opt out of hearings button should NOT open the modal
    await click('[data-test-button-opt-out-hearing-popup="4"]');

    // check that button on the "opt out of hearings" modal is not displaying
    assert.notOk(find('[data-test-button="onConfirmOptOutHearing"]'));

    // ############ ASSIGNMENT 5 ################################################
    // Assignment 5 DOES have a disposition, so hearing buttons should be clickable

    // clicking the post hearings button should change the route
    await click('[data-test-button-post-hearing="5"]');

    assert.equal(currentURL(), '/my-projects/5/hearing/add');

    // return to the UPCOMING tab
    await click('[data-test-my-projects-button]');
    await click('[data-test-tab-button="upcoming"]');

    // clicking on the "opt out of hearings" button should open the modal
    await click('[data-test-button-opt-out-hearing-popup="5"]');

    // check that the button on the modal is displaying
    assert.ok(find('[data-test-button="onConfirmOptOutHearing"]'));
  });

  test('button for TO-REVIEW hearing submission does not show if there are no dispositions', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      tab: 'to-review',
      dispositions: [],
      project: this.server.create('project', {
        id: 31,
        actions: [
          server.create('action', { id: '32a6b44c-8c0c-ea11-a9a8-001dd830804f', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        ],
        dispositions: [],
      }),
    });

    this.server.create('assignment', {
      id: 5,
      tab: 'to-review',
      dispositions: [
        server.create('disposition', {
          id: 1,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectactionValue: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
          // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
      ],
      project: this.server.create('project', {
        id: 30,
        actions: [
          server.create('action', { id: '32a6b44c-8c0c-ea11-a9a8-001dd830804f', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        ],
        dispositions: [
          server.create('disposition', {
            id: 1,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectactionValue: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
            // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
        ],
      }),
    });

    await visit('/my-projects/to-review');

    // ############ ASSIGNMENT 4 ################################################
    // Assignment 4 DOES NOT have dispositions, so hearing buttons should be disabled

    // button should display, but should be disabled
    assert.ok(find('[data-test-button-post-hearing="4"]'));

    // clicking on the post hearing button should NOT change the route
    await click('[data-test-button-post-hearing="4"]');

    assert.equal(currentURL(), '/my-projects/to-review');

    // clicking on the opt out of hearings button should open NOT the modal
    await click('[data-test-button-opt-out-hearing-popup="4"]');

    // check that button on the "opt out of hearings" modal is not displaying
    assert.notOk(find('[data-test-button="onConfirmOptOutHearing"]'));

    // ############ ASSIGNMENT 5 ################################################
    // Assignment 5 DOES have a disposition, so hearing buttons should be clickable

    // clicking the post hearings button should change the route
    await click('[data-test-button-post-hearing="5"]');

    assert.equal(currentURL(), '/my-projects/5/hearing/add');

    // return to the to-review tab
    await click('[data-test-my-projects-button]');
    await click('[data-test-tab-button="to-review"]');

    // clicking on the "opt out of hearings" button should open the modal
    await click('[data-test-button-opt-out-hearing-popup="5"]');

    // check that the button on the modal is displaying
    assert.ok(find('[data-test-button="onConfirmOptOutHearing"]'));
  });

  test('modal does not open if user deletes hour or minute input', async function(assert) {
    this.server.create('assignment', {
      id: 4,
      tab: 'to-review',
      dispositions: [
        server.create('disposition', {
          id: 1,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectactionValue: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
          // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
        server.create('disposition', {
          id: 2,
          dcpPublichearinglocation: '',
          dcpDateofpublichearing: null,
          dcpProjectactionValue: '9bbfbec7-2407-ea11-a9aa-001dd8308025',
          // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        }),
      ],
      project: this.server.create('project', {
        id: 4,
        actions: [
          server.create('action', { id: '32a6b44c-8c0c-ea11-a9a8-001dd830804f', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          server.create('action', { id: '9bbfbec7-2407-ea11-a9aa-001dd8308025', dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        ],
        dispositions: [
          server.create('disposition', {
            id: 1,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectactionValue: '32a6b44c-8c0c-ea11-a9a8-001dd830804f',
            // action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 2,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectactionValue: '9bbfbec7-2407-ea11-a9aa-001dd8308025',
            // action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
          }),
        ],
      }),
    });

    await visit('/my-projects/4/hearing/add');

    // user selects radio button for a SINGLE hearing for ALL actions
    await click('[data-test-radio="all-action-yes"]');

    // user fills in a location input
    await fillIn('[data-test-allactions-input="location"]', '121 Bananas Ave, Queens, NY');

    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="location"]', 'keyup', {
      keyCode: 84, // t
    });

    // user clicks on date input box
    await click('[data-test-allactions-input="date"]');

    // user selects a calendar date
    const hearingDate = new Date('2020-10-21T00:00:00'); // Wednesday, October 21, 2020
    await Pikaday.selectDate(hearingDate);

    await fillIn('[data-test-allactions-input="hour"]', 6);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="hour"]', 'keyup');

    await fillIn('[data-test-allactions-input="minute"]', 30);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="minute"]', 'keyup');

    // user selects an option from the power-select dropdown
    await selectChoose('[data-test-allactions-dropdown="timeOfDay"]', 'PM');

    // mock the user deleting the hour input
    await fillIn('[data-test-allactions-input="hour"]', '');
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="hour"]', 'keyup');

    // clicking on checkHearing button should NOT open modal because user deleted hour input
    await click('[data-test-button="checkHearing"]');
    // assure that Confirm button in modal is not displayed
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // fill in the hour input again
    await fillIn('[data-test-allactions-input="hour"]', 7);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="hour"]', 'keyup');

    // mock the user deleting the minute input
    await fillIn('[data-test-allactions-input="minute"]', '');
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="minute"]', 'keyup');

    // clicking on checkHearing button should NOT open modal because user deleted minute input
    await click('[data-test-button="checkHearing"]');
    // assure that Confirm button in modal is not displayed
    assert.notOk(find('[data-test-button="confirmHearing"]'));

    // fill in the minute input again
    await fillIn('[data-test-allactions-input="minute"]', 45);
    // user triggers a keyup event (necessary for acceptance test)
    await triggerEvent('[data-test-allactions-input="minute"]', 'keyup');

    // clicking on checkHearing button SHOULD open modal
    await click('[data-test-button="checkHearing"]');

    // check that confirmHearing button in modal is present
    assert.ok(find('[data-test-button="confirmHearing"]'));

    // make sure that the hearing location in the modal equals the input value
    assert.equal(this.element.querySelector('.hearing-location').textContent, '121 Bananas Ave, Queens, NY');
    assert.equal(this.element.querySelector('.hearing-time').textContent, '7:45 PM');
    assert.equal(this.element.querySelector('.hearing-date').textContent, '10/21/2020');

    await click('[data-test-button="confirmHearing"]');

    assert.equal(currentURL(), '/my-projects/4/hearing/done');
  });
});
