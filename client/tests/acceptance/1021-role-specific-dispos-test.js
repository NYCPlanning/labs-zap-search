import { module, test } from 'qunit';
import {
  visit,
  click,
  triggerEvent,
  fillIn,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { Interactor as Pikaday } from 'ember-pikaday/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { selectChoose } from 'ember-power-select/test-support';

module('Acceptance | 1021 role specific dispos', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /1021-role-specific-dispos', async function(assert) {
    this.server.create('assignment', {
      tab: 'to-review',
      dcpLupteammemberrole: 'BB',
      project: this.server.create('project', {
        id: 4,
        actions: [
          this.server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          this.server.create('action', { id: 2, dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
        ],
        dispositions: [
          this.server.create('disposition', {
            id: 1,
            dcpRepresenting: 'Borough Board',
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectactionValue: 1,
          }),
          this.server.create('disposition', {
            id: 2,
            dcpRepresenting: 'Borough Board',
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectactionValue: 2,
          }),
          this.server.create('disposition', {
            id: 3,
            dcpRepresenting: 'Community Board',
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectactionValue: 2,
          }),
          this.server.create('disposition', {
            id: 4,
            dcpRepresenting: 'Community Board',
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpProjectactionValue: 2,
          }),
        ],
      }),
      dispositions: this.server.schema.dispositions.all(),
    });

    await authenticateSession();

    await visit('/my-projects/1/hearing/add');

    const addressTestString = '121 Bananas Ave, Queens, NY';

    await click('[data-test-radio="all-action-yes"]');
    await fillIn('[data-test-allactions-input="location"]', addressTestString);
    await triggerEvent('[data-test-allactions-input="location"]', 'keyup', { keyCode: 84 });
    await click('[data-test-button="checkHearing"]');
    await click('[data-test-allactions-input="date"]');
    await Pikaday.selectDate(new Date('2020-10-21T00:00:00'));
    await click('[data-test-button="checkHearing"]');
    await fillIn('[data-test-allactions-input="hour"]', 6);
    await click('[data-test-button="checkHearing"]');
    await fillIn('[data-test-allactions-input="minute"]', 30);
    await click('[data-test-button="checkHearing"]');
    await selectChoose('[data-test-allactions-dropdown="timeOfDay"]', 'PM');
    await click('[data-test-button="checkHearing"]');
    await click('[data-test-button="confirmHearing"]');

    const submittedDispos = this.server.schema.dispositions.where({
      dcpPublichearinglocation: addressTestString,
    });

    assert.equal(submittedDispos.length, 2, 'Only affected dispositions are those for assigned role');
  });
});
