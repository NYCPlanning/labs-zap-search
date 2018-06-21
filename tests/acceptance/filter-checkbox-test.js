import { module, test } from 'qunit';
import { visit, currentURL, click} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';


module('Acceptance | filter checkbox', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /filter-checkbox', async function(assert) {
    await visit('/');
    await click ('.status-checkbox li:first-child a');
    //await andThen(()=>assert.equal(

    	//currentValues=projectFilters.dcp_publicstatus??
    	//=> find (.'results')

    assert.equal(currentURL(), '/filter-checkbox');
  });
});
