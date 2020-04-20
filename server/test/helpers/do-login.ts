import * as jwt from 'jsonwebtoken';

export const doLogin = (appServer, request) => {
  // the signing secret arg here is copied from the test.env file
  // this should be dealt with in a different way...
  const mockJWT = jwt.sign({
    mail: 'labs_dl@planning.nyc.gov',
    exp: 1565932329 * 100,
  }, 'test');

  return request(appServer)
    .get(`/login?accessToken=${mockJWT}`)
};
