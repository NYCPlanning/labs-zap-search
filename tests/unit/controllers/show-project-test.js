import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Controller | show-project', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

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

  test('hasBBLFeatureCollectionGeometry is null when geometry is null', async function(assert) {
    const controller = this.owner.lookup('controller:show-project');
    assert.ok(controller);

    const project = server.create('project', {
      bbl_featurecollection: {
        features: [{
          type: 'Feature',
          geometry: null,
        }],
      },
    });
    const projectModel = await this.owner.lookup('service:store').findRecord('project', project.id);

    controller.model = projectModel;

    const hasNoGeometry = controller.hasBBLFeatureCollectionGeometry;

    assert.equal(hasNoGeometry, null);
  });

  test('hasBBLFeatureCollectionGeometry is 0 when features is empty', async function(assert) {
    const controller = this.owner.lookup('controller:show-project');
    assert.ok(controller);

    const project = server.create('project', {
      bbl_featurecollection: {
        features: [],
      },
    });
    const projectModel = await this.owner.lookup('service:store').findRecord('project', project.id);

    controller.model = projectModel;

    const hasEmptyFeatures = controller.hasBBLFeatureCollectionGeometry;

    assert.equal(hasEmptyFeatures, 0);
  });
});
