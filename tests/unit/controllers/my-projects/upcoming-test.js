import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Controller | my-projects/upcoming', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('it exists', function(assert) {
    const controller = this.owner.lookup('controller:my-projects/upcoming');
    assert.ok(controller);
  });

  test('Assignments display in correct order by related project.dcp_certificationtargetdate', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/upcoming');

    const dateA = new Date('2020-10-21T00:00:00'); // October 21, 2020
    const dateB = new Date('2020-11-21T00:00:00'); // November 21, 2020
    const dateC = new Date('2020-12-21T00:00:00'); // December 21, 2020

    await this.owner.lookup('service:store').createRecord('assignment', {
      id: 1,
      tab: 'upcoming',
      project: this.owner.lookup('service:store').createRecord('project', {
        dcp_certificationtargetdate: dateB,
      }),
    });

    await this.owner.lookup('service:store').createRecord('assignment', {
      id: 2,
      tab: 'upcoming',
      project: this.owner.lookup('service:store').createRecord('project', {
        dcp_certificationtargetdate: dateC,
      }),
    });

    await this.owner.lookup('service:store').createRecord('assignment', {
      id: 3,
      tab: 'upcoming',
      project: this.owner.lookup('service:store').createRecord('project', {
        dcp_certificationtargetdate: dateA,
      }),
    });

    const assignmentModel = await this.owner.lookup('service:store').findAll('assignment');

    controller.model = assignmentModel;

    const projectDates = controller.model.map(assignment => assignment.project.dcp_certificationtargetdate.getMonth());

    assert.equal(projectDates[0], 10);
    assert.equal(projectDates[1], 11);
    assert.equal(projectDates[2], 9);

    // the awkwardly named "sortedProject" computed actually sorts assignments based on their related project.
    const sortedProjectsDates = controller.sortedProjects.map(assignment => assignment.project.dcp_certificationtargetdate.getMonth());

    assert.equal(sortedProjectsDates[0], 9);
    assert.equal(sortedProjectsDates[1], 10);
    assert.equal(sortedProjectsDates[2], 11);
  });
});
