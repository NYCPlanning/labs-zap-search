import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Controller | my-projects/archive', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    const controller = this.owner.lookup('controller:my-projects/archive');
    assert.ok(controller);
  });

  test('Projects display in correct order', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/archive');

    const dateA = new Date('2020-10-21T00:00:00'); // October 21, 2020
    const dateB = new Date('2020-11-21T00:00:00'); // November 21, 2020
    const dateC = new Date('2020-12-21T00:00:00'); // December 21, 2020

    await this.owner.lookup('service:store').createRecord('project', {
      id: 1,
      tab: 'archive',
      dcpProjectcompleted: dateB,
    });

    await this.owner.lookup('service:store').createRecord('project', {
      id: 2,
      tab: 'archive',
      dcpProjectcompleted: dateC,
    });

    await this.owner.lookup('service:store').createRecord('project', {
      id: 3,
      tab: 'archive',
      dcpProjectcompleted: dateA,
    });

    const projectModel = await this.owner.lookup('service:store').findAll('project');

    controller.model = projectModel;

    const projectDates = controller.model.map(p => p.dcpProjectcompleted.getMonth());

    assert.equal(projectDates[0], 10);
    assert.equal(projectDates[1], 11);
    assert.equal(projectDates[2], 9);

    const sortedProjectsDates = controller.sortedProjects.map(p => p.dcpProjectcompleted.getMonth());

    assert.equal(sortedProjectsDates[0], 11);
    assert.equal(sortedProjectsDates[1], 10);
    assert.equal(sortedProjectsDates[2], 9);
  });
});
