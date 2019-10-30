import { module, test } from 'qunit';
import {
  visit,
  click,
  currentURL,
  fillIn,
  triggerEvent,
  pauseTest,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { Interactor as Pikaday } from 'ember-pikaday/test-support';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { selectChoose } from 'ember-power-select/test-support';
import { invalidateSession, authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | user send city record form', function(hooks) {
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

  test('user can send City Record email', async function(assert) {
    this.server.create('assignment', {
      id: 5,
      tab: 'to-review',
      dispositions: [
        server.create('disposition', {
          id: 17,
          dcpRecommendationsubmittedbyname: 'QNCB2',
          action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
        }),
        server.create('disposition', {
          id: 18,
          dcpRecommendationsubmittedbyname: 'QNCB2',
          action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        }),
        server.create('disposition', {
          id: 19,
          dcpRecommendationsubmittedbyname: 'QNCB2',
          action: server.create('action', { dcpName: 'Business Improvement District', dcpUlurpnumber: 'I030148MMQ' }),
        }),
        server.create('disposition', {
          id: 20,
          dcpRecommendationsubmittedbyname: 'QNCB2',
          action: server.create('action', { dcpName: 'Change in City Map', dcpUlurpnumber: '200088ZMX' }),
        }),
        server.create('disposition', {
          id: 21,
          dcpRecommendationsubmittedbyname: 'QNCB2',
          action: server.create('action', { dcpName: 'Enclosed Sidewalk Cafe', dcpUlurpnumber: '190172ZMK' }),
        }),
        server.create('disposition', {
          id: 22,
          dcpRecommendationsubmittedbyname: 'QNCB2',
          action: server.create('action', { dcpName: 'Large Scale Special Permit', dcpUlurpnumber: 'N190257ZRK' }),
        }),
        server.create('disposition', {
          id: 23,
          dcpRecommendationsubmittedbyname: 'QNCB2',
          action: server.create('action', { dcpName: 'Zoning Certification', dcpUlurpnumber: '190256ZMK' }),
        }),
      ],
      project: this.server.create('project', {
        dcpProjectname: 'Pacific Bay Rezoning',
        dcpProjectbrief: 'Natus rerum quas facere. Doloremque officiis dolorem fuga. Ratione et quasi magni cumque laboriosam. Et et commodi ex rerum accusantium. Reiciendis ipsum enim veritatis ea. Officiis earum corporis et porro voluptatem et fugit ad. Quam non esse aliquid voluptatem aspernatur. Ut et doloremque quas recusandae provident possimus dolor odio. Voluptatem voluptatem amet sint blanditiis eaque.',
        dispositions: [
          server.create('disposition', {
            id: 17,
            dcpRecommendationsubmittedbyname: 'QNCB2',
            action: server.create('action', { dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          }),
          server.create('disposition', {
            id: 18,
            dcpRecommendationsubmittedbyname: 'QNCB2',
            action: server.create('action', { dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
          }),
          server.create('disposition', {
            id: 19,
            dcpRecommendationsubmittedbyname: 'QNCB2',
            action: server.create('action', { dcpName: 'Business Improvement District', dcpUlurpnumber: 'I030148MMQ' }),
          }),
          server.create('disposition', {
            id: 20,
            dcpRecommendationsubmittedbyname: 'QNCB2',
            action: server.create('action', { dcpName: 'Change in City Map', dcpUlurpnumber: '200088ZMX' }),
          }),
          server.create('disposition', {
            id: 21,
            dcpRecommendationsubmittedbyname: 'QNCB2',
            action: server.create('action', { dcpName: 'Enclosed Sidewalk Cafe', dcpUlurpnumber: '190172ZMK' }),
          }),
          server.create('disposition', {
            id: 22,
            dcpRecommendationsubmittedbyname: 'QNCB2',
            action: server.create('action', { dcpName: 'Large Scale Special Permit', dcpUlurpnumber: 'N190257ZRK' }),
          }),
          server.create('disposition', {
            id: 23,
            dcpRecommendationsubmittedbyname: 'QNCB2',
            action: server.create('action', { dcpName: 'Zoning Certification', dcpUlurpnumber: '190256ZMK' }),
          }),
        ],
      }),
    });

    await visit('/my-projects/5/hearing/add');

    // user selects radio button for one action per hearing
    await click('[data-test-radio="all-action-no"]');

    // ## DISPOSITION 1 ################### duplicate with Disposition 2 & 5
    await fillIn('[data-test-location-input="17"]', '121 Bananas Ave, Queens, NY');
    await triggerEvent('[data-test-location-input="17"]', 'keyup');
    // user clicks on date input box
    await click('[data-test-date-input="17"]');
    await Pikaday.selectDate(new Date('2020-10-21T00:00:00'));
    await fillIn('[data-test-hour-input="17"]', 6);
    await fillIn('[data-test-minute-input="17"]', 30);
    await selectChoose('[data-test-timeofday-dropdown="17"] .timeofday-dropdown', 'PM');

    // ## DISPOSITION 2 ################### duplicate with Disposition 1 & 5
    await fillIn('[data-test-location-input="18"]', '121 Bananas Ave, Queens, NY');
    await triggerEvent('[data-test-location-input="18"]', 'keyup');
    await click('[data-test-date-input="18"]');
    await Pikaday.selectDate(new Date('2020-10-21T00:00:00'));
    await fillIn('[data-test-hour-input="18"]', 6);
    await fillIn('[data-test-minute-input="18"]', 30);
    await selectChoose('[data-test-timeofday-dropdown="18"] .timeofday-dropdown', 'PM');

    // ## DISPOSITION 3 #######################################################
    await fillIn('[data-test-location-input="19"]', '186 Alligators Ave, Staten Island, NY');
    await triggerEvent('[data-test-location-input="19"]', 'keyup');
    await click('[data-test-date-input="19"]');
    await Pikaday.selectDate(new Date('2021-11-12T00:00:00'));
    await fillIn('[data-test-hour-input="19"]', 5);
    await fillIn('[data-test-minute-input="19"]', 45);
    await selectChoose('[data-test-timeofday-dropdown="19"] .timeofday-dropdown', 'PM');

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

    // ## DISPOSITION 5 ################### duplicate with Disposition 1 & 2
    await fillIn('[data-test-location-input="21"]', '121 Bananas Ave, Queens, NY');
    await triggerEvent('[data-test-location-input="21"]', 'keyup');
    await click('[data-test-date-input="21"]');
    await Pikaday.selectDate(new Date('2020-10-21T00:00:00'));
    await fillIn('[data-test-hour-input="21"]', 6);
    await fillIn('[data-test-minute-input="21"]', 30);
    await selectChoose('[data-test-timeofday-dropdown="21"] .timeofday-dropdown', 'PM');

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

    await click('[data-test-button="confirmHearing"]');

    assert.equal(currentURL(), '/my-projects/5/hearing/done');

    await pauseTest();

    await click('[data-test-city-record-button="17"]');

    // in modal
    await click('[data-test-radio="accessibility-no"]');
    await fillIn('[data-test-input="requester-full-name"]', 'first last');
    await fillIn('[data-test-input="requester-phone-number"]', '555-555-5555');
    await fillIn('[data-test-input="requester-email"]', 'test@planning.com');
    await fillIn('[data-test-input="accessibility-contact-full-name"]', 'first last');
    await fillIn('[data-test-input="accessibility-contact-phone-number"]', '777-777-7777');
    await fillIn('[data-test-input="accessibility-contact-email"]', 'test2@planning.com');
    await click('[data-test-input="accessibility-contact-deadline"]');
    await Pikaday.selectDate(new Date('2020-11-21T00:00:00'));

    await click('[data-test-button="modal-send-to-city-record"]');

    assert.equal(currentURL(), '/my-projects/5/hearing/done');
  });
});
