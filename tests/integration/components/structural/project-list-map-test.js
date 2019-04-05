import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import ProjectListMapComponent from 'labs-zap-search/components/structural/project-list-map';
import setupMockBoxHooks from '../../../helpers/mapbox-gl-stub';

module('Integration | Component | structural/project-list-map', function(hooks) {
  setupRenderingTest(hooks);
  setupMockBoxHooks(hooks);

  hooks.beforeEach(function() {
    const that = this;
    class ProjectListMapStub extends ProjectListMapComponent {
      init(...args) {
        super.init(...args);

        that.component = this;
      }
    }

    this.owner.register('component:structural/project-list-map', ProjectListMapStub);
  });

  test('it renders', async function(assert) {
    this.mapboxEventStub = {
      target: {
        getZoom: () => 15,
        queryRenderedFeatures: () => [],
      },
    };

    await render(hbs`
      {{structural/project-list-map
        tiles=(array 'https://google.com')
      }}
    `);

    assert.equal(this.element.textContent.trim(), '');
    assert.equal(this.component.tileMode, 'polygons');
    assert.deepEqual(this.component.tilesForZoom, ['https://google.com?type=polygons']);
  });
});
