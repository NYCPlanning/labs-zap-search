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
      bblFeaturecollection: {
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
      bblFeaturecollection: {
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
      bblFeaturecollection: {
        features: [],
      },
    });
    const projectModel = await this.owner.lookup('service:store').findRecord('project', project.id);

    controller.model = projectModel;

    const hasEmptyFeatures = controller.hasBBLFeatureCollectionGeometry;

    assert.equal(hasEmptyFeatures, 0);
  });

  test('isUserAssignedToProject is false when user project ids do not match current project id', async function(assert) {
    const controller = this.owner.lookup('controller:show-project');
    assert.ok(controller);

    const user = {
      id: 1,
      projects: [
        {
          dcpName: 'P2012M046',
        },
        {
          dcpName: 'N2014Q176',
        },
      ],
      assignments: [],
    };

    const project = this.server.create('project', {
      dcpName: 'P2003B056',
      dispositions: this.server.createList('disposition', 2),
    });

    const projectModel = await this.owner.lookup('service:store')
      .findRecord('project', project.id, { include: 'dispositions' });

    controller.model = projectModel;
    controller.user = user;
    controller.set('session.isAuthenticated', true);

    assert.equal(controller.isUserAssignedToProject, false);
  });

  test('isUserAssignedToProject is true when user project ids match current project id', async function(assert) {
    const controller = this.owner.lookup('controller:show-project');
    assert.ok(controller);

    const user = {
      id: 1,
      assignments: [
        {
          project: { id: 'N2014Q176' },
        },
        {
          project: { id: 'P2012M046' },
        },
      ],
    };

    const project = server.create('project', {
      id: 'P2012M046',
    });

    const projectModel = await this.owner.lookup('service:store').findRecord('project', project.id);

    controller.model = projectModel;
    controller.user = user;
    controller.set('session.isAuthenticated', true);

    assert.equal(controller.isUserAssignedToProject, true);
  });
});
