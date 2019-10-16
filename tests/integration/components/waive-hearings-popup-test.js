import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { updateEachObjectInArray } from 'labs-zap-search/components/waive-hearings-popup';
import EmberObject from '@ember/object';

module('Integration | Component | waive-hearings-popup', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    // Template block usage:
    await render(hbs`
      {{#waive-hearings-popup
        showPopup=true}}
      {{/waive-hearings-popup}}
      <div id="reveal-modal-container"></div>
    `);

    const waiveHearingsMessageOnPopup = this.element.textContent.trim();

    const messageVisible = waiveHearingsMessageOnPopup.includes('Are you sure you want to opt out of submitting hearings?');

    assert.ok(messageVisible);
  });

  test('updateEachObjectInArray function works', function(assert) {
    const ourDisps = EmberObject.extend({});

    const disp1 = ourDisps.create({
      id: 1,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
    });

    const disp2 = ourDisps.create({
      id: 2,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
    });

    const disp3 = ourDisps.create({
      id: 3,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
    });

    const disp4 = ourDisps.create({
      id: 4,
      dcpPublichearinglocation: '',
      dcpDateofpublichearing: null,
    });

    // mimics each project's array of dispositions
    const dispositions = [disp1, disp2, disp3, disp4];

    // run the updateEachObjectInArray function, which...
    updateEachObjectInArray(dispositions, 'dcpPublichearinglocation', 'waived');

    const eachLocation = dispositions.map(disp => disp.dcpPublichearinglocation);

    assert.equal(eachLocation.join(','), 'waived,waived,waived,waived');
  });
});
