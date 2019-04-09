import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | show-project', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it runs handleMapLoad', function(assert) {
    const controller = this.owner.lookup('controller:show-project');
    assert.ok(controller);

    controller.model = {
      bbl_featurecollection: {
        features: [{
          type: 'Feature',
          geometry: {
            coordinates: [0, 0],
            type: 'Point',
          },
        }],
      },
    };

    // stub the handle map load signature
    controller.handleMapLoad({
      addControl() {},
      fitBounds() {},
    });
  });
});
