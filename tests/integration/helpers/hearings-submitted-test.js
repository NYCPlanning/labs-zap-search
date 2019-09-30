import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { hearingsSubmitted } from 'labs-zap-search/helpers/hearings-submitted';

module('Integration | Helper | hearingsSubmitted', function(hooks) {
  setupRenderingTest(hooks);

  test('returns true if hearings submitted for a project', async function(assert) {
    const hearingDate = new Date('2020-10-21T00:00:00'); // Wednesday, October 21, 2020

    this.set('dispositions', [
      {
        dcpPublichearinglocation: 'bananas',
        dcpDateofpublichearing: hearingDate,
      },
      {
        dcpPublichearinglocation: 'oranges',
        dcpDateofpublichearing: hearingDate,
      },
    ]);

    const areHearingsSubmitted = hearingsSubmitted(this.get('dispositions'));

    assert.equal(areHearingsSubmitted, true);
  });

  test('returns false if hearings not submitted for a project', async function(assert) {
    this.set('dispositions', [
      {
        dcpPublichearinglocation: '',
        dcpDateofpublichearing: null,
      },
      {
        dcpPublichearinglocation: '',
        dcpDateofpublichearing: null,
      },
    ]);

    const areHearingsSubmitted = hearingsSubmitted(this.get('dispositions'));

    assert.equal(areHearingsSubmitted, false);
  });
});
