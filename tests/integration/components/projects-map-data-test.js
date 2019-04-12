import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';
import Evented from '@ember/object/evented';
import setupMockBoxHooks from '../../helpers/mapbox-gl-stub';

module('Integration | Component | projects-map-data', function(hooks) {
  setupRenderingTest(hooks);
  setupMockBoxHooks(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{projects-map-data}}`);

    assert.equal(this.element.textContent.trim(), '');
  });

  test('it accepts and runs a map click event', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    this.set('myAction', function() {
      assert.ok('did click');
    });

    await render(hbs`
      {{projects-map-data
        onMapClick=(action myAction)
      }}
    `);

    await triggerEvent('.mapbox-gl', 'click');
  });

  test('it handles a mousemove event, sets tooltip', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    await render(hbs`
      {{projects-map-data}}
    `);

    this.mapboxEventStub = {
      target: {
        queryRenderedFeatures: () => [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
        }],
      },
      point: { x: 0, y: 0 },
    };

    await triggerEvent('.mapbox-gl', 'mousemove');

    assert.ok(find('.map-tooltip'));
  });

  test('it handles event actions', async function(assert) {
    this.owner.register('service:result-map-events', Service.extend(Evented));
    this.mapboxEventStub = {
      target: {},
      point: { x: 0, y: 0 },
      setLayoutProperty() { return this; },
      setPaintProperty() { return this; },
      setFilter() { return this; },
      flyTo() {},
    };

    await render(hbs`
      {{projects-map-data}}
    `);

    const resultMapEvents = this.owner.lookup('service:result-map-events');
    resultMapEvents.trigger('hoverPoint', {});
    resultMapEvents.trigger('unHoverPoint', {});
    resultMapEvents.trigger('clickPoint', {});

    assert.ok(true);
  });
});
