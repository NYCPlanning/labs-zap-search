import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Unit | Controller | my-projects/upcoming', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    const controller = this.owner.lookup('controller:my-projects/upcoming');
    assert.ok(controller);
  });

  test('Projects display in correct order', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/upcoming');

    const dateA = new Date('2020-10-21T00:00:00'); // October 21, 2020
    const dateB = new Date('2020-11-21T00:00:00'); // November 21, 2020
    const dateC = new Date('2020-12-21T00:00:00'); // December 21, 2020

    await this.owner.lookup('service:store').createRecord('project', {
      id: 1,
      dcp_name: 'N2018Q077',
      tab: 'upcoming',
      publicReviewPlannedStartDate: dateB,
    });

    await this.owner.lookup('service:store').createRecord('project', {
      id: 2,
      dcp_name: 'P2012M046',
      tab: 'upcoming',
      publicReviewPlannedStartDate: dateC,
    });

    await this.owner.lookup('service:store').createRecord('project', {
      id: 3,
      dcp_name: 'K1993M046',
      tab: 'upcoming',
      publicReviewPlannedStartDate: dateA,
    });

    const projectModel = await this.owner.lookup('service:store').findAll('project');

    controller.model = projectModel;

    const projectDates = controller.model.map(p => p.publicReviewPlannedStartDate.getMonth());

    assert.equal(projectDates[0], 10);
    assert.equal(projectDates[1], 11);
    assert.equal(projectDates[2], 9);

    const sortedProjectsDates = controller.sortedProjects.map(p => p.publicReviewPlannedStartDate.getMonth());

    assert.equal(sortedProjectsDates[0], 9);
    assert.equal(sortedProjectsDates[1], 10);
    assert.equal(sortedProjectsDates[2], 11);
  });
});
