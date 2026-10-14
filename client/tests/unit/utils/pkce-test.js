import { module, test } from 'qunit';
import { returnCodeVerifier, createCodeChallenge } from 'labs-zap-search/utils/pkce';

// Example values from RFC 7636 Appendix B (https://tools.ietf.org/html/rfc7636#appendix-B)
const RFC_CODE_VERIFIER = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';
const RFC_CODE_CHALLENGE = 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM';

module('Unit | Utility | pkce', function() {
  module('returnCodeVerifier', function() {
    test('is between 43 and 128 characters long', function(assert) {
      const { length } = returnCodeVerifier();

      // RFC 7636 section 4.1
      assert.ok(length >= 43 && length <= 128, `length was ${length}`);
    });

    test('only uses unreserved characters', function(assert) {
      // RFC 7636 section 4.1
      assert.ok(/^[A-Za-z0-9\-._~]+$/.test(returnCodeVerifier()));
    });

    test('returns a different value each call', function(assert) {
      assert.notEqual(returnCodeVerifier(), returnCodeVerifier());
    });
  });

  module('createCodeChallenge', function() {
    test('matches the RFC 7636 example challenge', async function(assert) {
      const codeChallenge = await createCodeChallenge(RFC_CODE_VERIFIER);

      assert.equal(codeChallenge, RFC_CODE_CHALLENGE);
    });

    test('is base64url encoded without padding', async function(assert) {
      const codeChallenge = await createCodeChallenge(returnCodeVerifier());

      assert.notOk(/[+/=]/.test(codeChallenge), codeChallenge);
    });
  });
});
