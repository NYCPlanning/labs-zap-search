import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import moment from 'moment';

module('Unit | Controller | my-projects/project/hearing/add', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('saveHearingForm changes the project model', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/project/hearing/add');
    // assert that controller exists
    assert.ok(controller);

    // create a project with hearing in a one-to-one relationship
    const project = server.create('project', {
      dcp_projectname: 'my new project',
      afterCreate(ourProject, server) {
        server.create('hearing', { ourProject });
      },
    });

    // set up the project model
    const projectModel = await this.owner.lookup('service:store').findRecord(
      'project', project.id, { include: 'hearing' },
    );

    // set the controller's model to the projectModel
    controller.model = projectModel;

    // set the transitionToRoute action
    controller.transitionToRoute = function(route) {
      assert.equal(route, '/my-projects/to-review');
    };

    // test that location attribute and date attribute in hearing model are empty at first
    assert.equal(controller.model.hearing.get('location'), '');
    assert.equal(controller.model.hearing.get('date'), null);

    const hearingDate = new Date('2020-10-21T00:00:00'); // Wednesday, October 21, 2020
    const hearingTime = new Date('1899-12-31T14:09:00'); // 2:09pm

    // these act as the input values on the hearing form
    // because we use geosearch, we need to grab the "label" attribute, which has an address string
    controller.location = { label: '121 Minnesota Ave' };
    // user inputs a date
    controller.date = hearingDate;
    // user inputs a time
    controller.time = hearingTime;
    // user inputs additional location info
    controller.additionalLocationInfo = 'gym north of P.S. 23';

    // assert that hearing location, date, time, and additional location info are updated on the controller
    assert.equal(controller.location.label, '121 Minnesota Ave');
    assert.equal(controller.date, hearingDate);
    assert.equal(controller.time, hearingTime);
    assert.equal(controller.additionalLocationInfo, 'gym north of P.S. 23');

    // run the action that should alter the model
    assert.ok(controller.saveHearingForm);
    controller.saveHearingForm();

    // grab the month, hour, and minutes values of the model's hearing.date
    const modelMonth = moment(controller.model.hearing.get('date')).month();
    const modelHour = moment(controller.model.hearing.get('date')).hour();
    const modelMinutes = moment(controller.model.hearing.get('date')).minute();

    // test that model has been altered
    assert.equal(controller.model.hearing.get('location'), '121 Minnesota Ave; gym north of P.S. 23');
    // NOTE: Months are zero indexed, so January is month 0, October is month 9
    assert.equal(modelMonth, 9);
    assert.equal(modelHour, 14);
    assert.equal(modelMinutes, 9);
  });

  test('saveHearingForm model does not update if location is missing', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/project/hearing/add');
    // assert that controller exists
    assert.ok(controller);

    // create a project with hearing in a one-to-one relationship
    const project = server.create('project', {
      dcp_projectname: 'my new project',
      afterCreate(ourProject, server) {
        server.create('hearing', { ourProject });
      },
    });

    // set up the project model
    const projectModel = await this.owner.lookup('service:store').findRecord(
      'project', project.id, { include: 'hearing' },
    );

    // set the controller's model to the projectModel
    controller.model = projectModel;

    // set the transitionToRoute action
    controller.transitionToRoute = function(route) {
      assert.equal(route, '/my-projects/to-review');
    };

    // test that location attribute and date attribute in hearing model are empty at first
    assert.equal(controller.model.hearing.get('location'), '');
    assert.equal(controller.model.hearing.get('date'), null);

    const hearingDate = new Date('2020-10-21T00:00:00'); // Wednesday, October 21, 2020
    const hearingTime = new Date('1899-12-31T14:09:00'); // 2:09pm

    // controller.location is missing
    controller.date = hearingDate;
    controller.location = null;
    controller.time = hearingTime;

    // run saveHearingForm action
    assert.ok(controller.saveHearingForm);
    controller.saveHearingForm();

    // test that model has not been altered
    assert.equal(controller.model.hearing.get('location'), '');
    assert.equal(controller.model.hearing.get('date'), null);
  });

  test('saveHearingForm model does not update if date is missing', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/project/hearing/add');
    // assert that controller exists
    assert.ok(controller);

    // create a project with hearing in a one-to-one relationship
    const project = server.create('project', {
      dcp_projectname: 'my new project',
      afterCreate(ourProject, server) {
        server.create('hearing', { ourProject });
      },
    });

    // set up the project model
    const projectModel = await this.owner.lookup('service:store').findRecord(
      'project', project.id, { include: 'hearing' },
    );

    // set the controller's model to the projectModel
    controller.model = projectModel;

    // set the transitionToRoute action
    controller.transitionToRoute = function(route) {
      assert.equal(route, '/my-projects/to-review');
    };

    // test that location attribute and date attribute in hearing model are empty at first
    assert.equal(controller.model.hearing.get('location'), '');
    assert.equal(controller.model.hearing.get('date'), null);

    const hearingTime = new Date('1899-12-31T14:09:00'); // 2:09pm

    // controller.date is empty
    controller.date = null;
    controller.location = { label: '121 Minnesota Ave' };
    controller.time = hearingTime;

    assert.ok(controller.saveHearingForm);
    controller.saveHearingForm();

    // test that model has not been altered
    assert.equal(controller.model.hearing.get('location'), '');
    assert.equal(controller.model.hearing.get('date'), null);
  });

  test('saveHearingForm model does not update if time is missing', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/project/hearing/add');
    // assert that controller exists
    assert.ok(controller);

    // create a project with hearing in a one-to-one relationship
    const project = server.create('project', {
      dcp_projectname: 'my new project',
      afterCreate(ourProject, server) {
        server.create('hearing', { ourProject });
      },
    });

    // set up the project model
    const projectModel = await this.owner.lookup('service:store').findRecord(
      'project', project.id, { include: 'hearing' },
    );

    // set the controller's model to the projectModel
    controller.model = projectModel;

    // set the transitionToRoute action
    controller.transitionToRoute = function(route) {
      assert.equal(route, '/my-projects/to-review');
    };

    // test that location attribute and date attribute in hearing model are empty at first
    assert.equal(controller.model.hearing.get('location'), '');
    assert.equal(controller.model.hearing.get('date'), null);

    const hearingDate = new Date('2020-10-21T00:00:00'); // Wednesday, October 21, 2020

    // controller.time is empty
    controller.date = hearingDate;
    controller.location = { label: '121 Minnesota Ave' };
    controller.time = null;

    assert.ok(controller.saveHearingForm);
    controller.saveHearingForm();

    // test that model has not been altered
    assert.equal(controller.model.hearing.get('location'), '');
    assert.equal(controller.model.hearing.get('date'), null);
  });
});
