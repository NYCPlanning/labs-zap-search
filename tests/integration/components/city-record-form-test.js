import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

module('Integration | Component | city-record-form', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    const ourObject = EmberObject.extend({});

    const hearing = ourObject.create({
      disposition: ourObject.create({
        dcpPublichearinglocation: '121 Bananas Ave',
        dcpDateofpublichearing: new Date('2020-10-21T01:30:00'),
        dcpRecommendationsubmittedbyname: 'QNCB2',
      }),
    });

    this.set('hearing', hearing);

    // Template block usage:
    await render(hbs`
      <CityRecordForm hearing=hearing>
      </CityRecordForm>
      <div id="reveal-modal-container"></div>
    `);

    assert.equal(this.element.textContent.trim(), 'Send to City Record');
  });
});
