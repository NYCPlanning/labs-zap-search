import formatCdParam from 'labs-applicant-maps/utils/format-cd-param';
import { module, test } from 'qunit';

module('Unit | Utility | format-cd-param', function() {

  // Replace this with your real tests.
  test('it works', function(assert) {
    let result = formatCdParam('BK01');
    assert.ok(result);
  });

  test('it works', function(assert) {
    let result = formatCdParam('BK-1');
    assert.equal(result, 'BK01');
  });
});
