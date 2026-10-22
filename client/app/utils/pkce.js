// Simplified and based on https://github.com/crouchcd/pkce-challenge

function base64UrlEncode(bytes) {
  const binary = String.fromCharCode(...bytes);

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export const returnCodeVerifier = function() {
  return base64UrlEncode(crypto.getRandomValues(new Uint8Array(64)));
};

// Creates the S256 code challenge for a given code verifier:
// BASE64URL(SHA256(codeVerifier))
export const createCodeChallenge = async function(codeVerifier) {
  const encodedCodeVerifier = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', encodedCodeVerifier);

  return base64UrlEncode(new Uint8Array(digest));
};
