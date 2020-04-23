import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | results-header-meta', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`
      <ResultsHeaderMeta>
        template block text
      </ResultsHeaderMeta>
    `);

    assert.ok(this.element.textContent.trim());
  });

  test('it shows count', async function (assert) {
    await render(hbs`
      <ResultsHeaderMeta
        @totalResults={{100}}
        @isRunning={{false}}
        @cachedProjectsLength={{10}}
      />
    `);

    assert.equal(find('[data-test-results-header="title"]').textContent.trim(), '100 projects match your filters');
  });

  test('it shows current total in memory', async function (assert) {
    await render(hbs`
      <ResultsHeaderMeta
        @totalResults={{100}}
        @isRunning={{false}}
        @cachedProjectsLength={{10}}
      />
    `);

    assert.equal(find('[data-test-results-meta="listing"]').textContent, 'listing 1-10');
  });

  test('it shows warning if exceeds or equals 5000', async function (assert) {
    await render(hbs`
      <ResultsHeaderMeta
        @totalResults={{5000}}
        @isRunning={{false}}
        @cachedProjectsLength={{10}}
      />
    `);

    assert.ok(find('[data-test-results-header="exceeds"]'));
  });

  test('it hides download if exceeds 5000', async function (assert) {
    await render(hbs`
      <ResultsHeaderMeta
        @totalResults={{5000}}
        @isRunning={{false}}
        @cachedProjectsLength={{10}}
      />
    `);

    assert.ok(find('[data-test-results-downlad="disabled"]'));
  });
});
