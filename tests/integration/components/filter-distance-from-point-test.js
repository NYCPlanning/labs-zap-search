import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMockBoxHooks from '../../helpers/mapbox-gl-stub';

module('Integration | Component | filter-distance-from-point', function(hooks) {
  setupRenderingTest(hooks);
  setupMockBoxHooks(hooks);

  test('it fires the click action', async function(assert) {
    this.mapboxEventStub = {
      target: {
        queryRenderedFeatures() {
          return [{
            geometry: {
              coordinates: [1, 1],
            },
          }];
        },
      },
    };

    // Set any properties with this.set('myProperty', 'value');
    this.set('clickHandler', function(val) {
      assert.deepEqual(val, [1, 1]);
    });

    await render(hbs`
      {{#mapbox-gl as |map|}} 
        {{filter-distance-from-point
          map=map
          shouldQueryFullMap=true
          pointGeometry=(array 0 0)
          radius=100
          onRadiusFilterClick=(action clickHandler)
        }}
      {{/mapbox-gl}}
    `);
  });

  test('it provides the circle from radius', async function(assert) {
    await render(hbs`
      {{#mapbox-gl as |map|}} 
        {{#filter-distance-from-point
          map=map
          shouldQueryFullMap=true
          pointGeometry=(array 0 0)
          radius=100 as |distance-point|}}
          {{distance-point.circleFromRadius}}
        {{/filter-distance-from-point}}
      {{/mapbox-gl}}
    `);

    assert.ok(this.element.textContent.trim());
  });
});
