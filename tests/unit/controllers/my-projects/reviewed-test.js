import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Controller | my-projects/reviewed', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('it exists', function(assert) {
    const controller = this.owner.lookup('controller:my-projects/reviewed');
    assert.ok(controller);
  });

  test('Projects display in correct order for Borough PRESIDENT', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/reviewed');

    const dateA = new Date('2020-10-21T00:00:00'); // October 21, 2020
    const dateB = new Date('2020-11-21T00:00:00'); // November 21, 2020
    const dateC = new Date('2020-12-21T00:00:00'); // December 21, 2020
    const dateD = new Date('2021-01-21T00:00:00'); // January 21, 2021

    await this.owner.lookup('service:store').createRecord('project', {
      id: 1,
      tab: 'reviewed',
      dcpLupteammemberrole: 'BP',
      milestones: [
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Borough President Review',
          dcpActualenddate: dateC,
        }),
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Borough Board Review',
          dcpActualenddate: dateD,
        }),
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Community Board Review',
          dcpActualenddate: dateD,
        }),
      ],
    });

    await this.owner.lookup('service:store').createRecord('project', {
      id: 2,
      tab: 'reviewed',
      dcpLupteammemberrole: 'BP',
      milestones: [
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Borough President Review',
          dcpActualenddate: dateA,
        }),
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Borough Board Review',
          dcpActualenddate: dateD,
        }),
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Community Board Review',
          dcpActualenddate: dateD,
        }),
      ],
    });

    await this.owner.lookup('service:store').createRecord('project', {
      id: 3,
      tab: 'reviewed',
      dcpLupteammemberrole: 'BP',
      milestones: [
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Borough President Review',
          dcpActualenddate: dateB,
        }),
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Borough Board Review',
          dcpActualenddate: dateD,
        }),
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Community Board Review',
          dcpActualenddate: dateD,
        }),
      ],
    });

    const projectModel = await this.owner.lookup('service:store').findAll('project');

    controller.model = projectModel;

    const projectDatesArray = controller.model.map(p => p.milestones.find(m => m.displayName === 'Borough President Review').dcpActualenddate);

    assert.equal(projectDatesArray[0].getMonth(), 11);
    assert.equal(projectDatesArray[1].getMonth(), 9);
    assert.equal(projectDatesArray[2].getMonth(), 10);

    const sortedProjectsDatesArray = controller.sortedProjects.map(p => p.sortingActualEndDate);

    assert.equal(sortedProjectsDatesArray[0].getMonth(), 11);
    assert.equal(sortedProjectsDatesArray[1].getMonth(), 10);
    assert.equal(sortedProjectsDatesArray[2].getMonth(), 9);
  });

  test('Projects display in correct order for BOROUGH BOARD', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/reviewed');

    const dateA = new Date('2020-10-21T00:00:00'); // October 21, 2020
    const dateB = new Date('2020-11-21T00:00:00'); // November 21, 2020
    const dateC = new Date('2020-12-21T00:00:00'); // December 21, 2020
    const dateD = new Date('2021-01-21T00:00:00'); // January 21, 2021

    await this.owner.lookup('service:store').createRecord('project', {
      id: 1,
      tab: 'reviewed',
      dcpLupteammemberrole: 'BB',
      milestones: [
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Borough President Review',
          dcpActualenddate: dateD,
        }),
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Borough Board Review',
          dcpActualenddate: dateC,
        }),
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Community Board Review',
          dcpActualenddate: dateD,
        }),
      ],
    });

    await this.owner.lookup('service:store').createRecord('project', {
      id: 2,
      tab: 'reviewed',
      dcpLupteammemberrole: 'BB',
      milestones: [
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Borough President Review',
          dcpActualenddate: dateD,
        }),
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Borough Board Review',
          dcpActualenddate: dateA,
        }),
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Community Board Review',
          dcpActualenddate: dateD,
        }),
      ],
    });

    await this.owner.lookup('service:store').createRecord('project', {
      id: 3,
      tab: 'reviewed',
      dcpLupteammemberrole: 'BB',
      milestones: [
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Borough President Review',
          dcpActualenddate: dateD,
        }),
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Borough Board Review',
          dcpActualenddate: dateB,
        }),
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Community Board Review',
          dcpActualenddate: dateD,
        }),
      ],
    });

    const projectModel = await this.owner.lookup('service:store').findAll('project');

    controller.model = projectModel;

    const projectDatesArray = controller.model.map(p => p.milestones.find(m => m.displayName === 'Borough Board Review').dcpActualenddate);

    assert.equal(projectDatesArray[0].getMonth(), 11);
    assert.equal(projectDatesArray[1].getMonth(), 9);
    assert.equal(projectDatesArray[2].getMonth(), 10);

    const sortedProjectsDatesArray = controller.sortedProjects.map(p => p.sortingActualEndDate);

    assert.equal(sortedProjectsDatesArray[0].getMonth(), 11);
    assert.equal(sortedProjectsDatesArray[1].getMonth(), 10);
    assert.equal(sortedProjectsDatesArray[2].getMonth(), 9);
  });

  test('Projects display in correct order for COMMUNITY BOARD', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/reviewed');

    const dateA = new Date('2020-10-21T00:00:00'); // October 21, 2020
    const dateB = new Date('2020-11-21T00:00:00'); // November 21, 2020
    const dateC = new Date('2020-12-21T00:00:00'); // December 21, 2020
    const dateD = new Date('2021-01-21T00:00:00'); // January 21, 2021

    await this.owner.lookup('service:store').createRecord('project', {
      id: 1,
      tab: 'reviewed',
      dcpLupteammemberrole: 'CB',
      milestones: [
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Borough President Review',
          dcpActualenddate: dateD,
        }),
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Borough Board Review',
          dcpActualenddate: dateD,
        }),
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Community Board Review',
          dcpActualenddate: dateC,
        }),
      ],
    });

    await this.owner.lookup('service:store').createRecord('project', {
      id: 2,
      tab: 'reviewed',
      dcpLupteammemberrole: 'CB',
      milestones: [
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Borough President Review',
          dcpActualenddate: dateD,
        }),
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Borough Board Review',
          dcpActualenddate: dateD,
        }),
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Community Board Review',
          dcpActualenddate: dateA,
        }),
      ],
    });

    await this.owner.lookup('service:store').createRecord('project', {
      id: 3,
      tab: 'reviewed',
      dcpLupteammemberrole: 'CB',
      milestones: [
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Borough President Review',
          dcpActualenddate: dateD,
        }),
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Borough Board Review',
          dcpActualenddate: dateD,
        }),
        this.owner.lookup('service:store').createRecord('milestone', {
          displayName: 'Community Board Review',
          dcpActualenddate: dateB,
        }),
      ],
    });

    const projectModel = await this.owner.lookup('service:store').findAll('project');

    controller.model = projectModel;

    const projectDatesArray = controller.model.map(p => p.milestones.find(m => m.displayName === 'Community Board Review').dcpActualenddate);

    assert.equal(projectDatesArray[0].getMonth(), 11);
    assert.equal(projectDatesArray[1].getMonth(), 9);
    assert.equal(projectDatesArray[2].getMonth(), 10);

    const sortedProjectsDatesArray = controller.sortedProjects.map(p => p.sortingActualEndDate);

    assert.equal(sortedProjectsDatesArray[0].getMonth(), 11);
    assert.equal(sortedProjectsDatesArray[1].getMonth(), 10);
    assert.equal(sortedProjectsDatesArray[2].getMonth(), 9);
  });
});
