import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

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
    const store = this.owner.lookup('service:store');

    const dateA = new Date('2020-10-21T00:00:00'); // October 21, 2020
    const dateB = new Date('2020-11-21T00:00:00'); // November 21, 2020
    const dateC = new Date('2020-12-21T00:00:00'); // December 21, 2020

    await store.createRecord('assignment', {
      project: store.createRecord('project', {
        id: 1,
        dcpProjectcompleted: dateB,
      }),
      tab: 'archive',
    });

    await store.createRecord('assignment', {
      project: store.createRecord('project', {
        id: 2,
        dcpProjectcompleted: dateC,
      }),
      tab: 'archive',
    });

    await store.createRecord('assignment', {
      project: store.createRecord('project', {
        id: 3,
        dcpProjectcompleted: dateA,
      }),
      tab: 'archive',
    });

    const assignmentModels = await store.findAll('assignment');

    controller.model = assignmentModels;

    const projectDates = controller.model.map(({ project: p }) => p.dcpProjectcompleted.getMonth());

    assert.equal(projectDates[0], 10);
    assert.equal(projectDates[1], 11);
    assert.equal(projectDates[2], 9);

    const sortedProjectsDates = controller.sortedAssignments.map(({ project: p }) => p.dcpProjectcompleted.getMonth());

    assert.equal(sortedProjectsDates[0], 11);
    assert.equal(sortedProjectsDates[1], 10);
    assert.equal(sortedProjectsDates[2], 9);
  });
});
