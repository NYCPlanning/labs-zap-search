import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import EmberObject from '@ember/object';

module('Unit | Controller | my-projects/project/recommendations/add', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('clicking on radio button saves to model', async function(assert) {
    const controller = this.owner.lookup('controller:my-projects/project/recommendations/add');
    assert.ok(controller);

    // Create 7 disposition objects to put into dispositions array
    const disp = EmberObject.extend({});

    // DISPOSITIONS THAT REPRESENT THE MODEL'S DISPOSITIONS ARRAY (project.dispositions)
    const disp1 = disp.create({
      id: 1,
      wasaquorumpresent: null,
    });

    const disp2 = disp.create({
      id: 2,
      wasaquorumpresent: null,
    });

    const disp3 = disp.create({
      id: 3,
      wasaquorumpresent: null,
    });

    const disp4 = disp.create({
      id: 4,
      wasaquorumpresent: null,
    });

    // represents project.dispositions
    const dispositionsArray = [disp1, disp2, disp3, disp4];

    // DISPOSITIONS THAT REPRESENT THE OBJECTS WITHIN THE dedupedHearings ARRAY
    // a dedupedHearing object that has 3 duplicate dispositions
    const dedupedHearing1 = disp.create({
      id: 1,
      wasaquorumpresent: null,
      duplicateDisps: [
        disp.create({
          id: 1,
          wasaquorumpresent: null,
        }),
        disp.create({
          id: 2,
          wasaquorumpresent: null,
        }),
        disp.create({
          id: 3,
          wasaquorumpresent: null,
        }),
      ],
    });

    // a dedupedHearing object that has 1 duplicate disposition
    const dedupedHearing2 = disp.create({
      id: 4,
      wasaquorumpresent: null,
      duplicateDisps: [
        disp.create({
          id: 4,
          wasaquorumpresent: null,
        }),
      ],
    });

    // set the transitionToRoute action
    controller.transitionToRoute = function(route) {
      assert.equal(route, 'my-projects/project/recommendations/done');
    };

    assert.ok(controller.updateDispositionAttr);

    // set dedupedHearing1 to true, corresponding dispositions on the model should be set to same
    controller.updateDispositionAttr(dedupedHearing1, dispositionsArray, 'wasaquorumpresent', true);
    assert.equal(dedupedHearing1.duplicateDisps[0].wasaquorumpresent, true);
    assert.equal(dispositionsArray[0].wasaquorumpresent, true);

    // set dedupedHearing1 to false, corresponing dispositions on the model should be set to same
    controller.updateDispositionAttr(dedupedHearing1, dispositionsArray, 'wasaquorumpresent', false);
    assert.equal(dedupedHearing1.duplicateDisps[0].wasaquorumpresent, false);
    assert.equal(dispositionsArray[0].wasaquorumpresent, false);

    // set dedupedHearing2 to true, corresponding disposition on the model should be set to same
    controller.updateDispositionAttr(dedupedHearing2, dispositionsArray, 'wasaquorumpresent', true);
    assert.equal(dedupedHearing2.duplicateDisps[0].wasaquorumpresent, true);
    assert.equal(dispositionsArray[3].wasaquorumpresent, true);


    // set dedupedHearing2 to false, corresponding disposition on the model should be set to same
    controller.updateDispositionAttr(dedupedHearing2, dispositionsArray, 'wasaquorumpresent', false);
    assert.equal(dedupedHearing2.duplicateDisps[0].wasaquorumpresent, false);
    assert.equal(dispositionsArray[3].wasaquorumpresent, false);
  });
});
