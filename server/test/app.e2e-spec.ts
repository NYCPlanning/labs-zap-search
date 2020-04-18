import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import * as nock from 'nock';
import * as mockedEnvPkg from 'mocked-env';
import { AppModule } from './../src/app.module';
import { doLogin } from './helpers/do-login';
import { extractJWT } from './helpers/extract-jwt';

const { 'default': mockedEnv } = mockedEnvPkg;

describe('AppController (e2e)', () => {
  let app;
  let restoreEnv;
  let scope;

  beforeAll(async () => {
    // Mocks the login handshake with CRM which allows Web API requests
    nock('https://login.microsoftonline.com')
      .post(uri => uri.includes('oauth2/token'))
      .reply(200, {
        token_type: 'Bearer',
        expires_in: '3600',
        ext_expires_in: '3600',
        expires_on: '1573159181',
        not_before: '1573155281',
        resource: 'https://dcppfsuat2.crm9.dynamics.com',
        access_token: 'test'
      })
      .persist();

    // Mocks the local environment with dummy data so the app can boot
    restoreEnv = mockedEnv({
      CRM_HOST: 'https://dcppfsuat2.crm9.dynamics.com',
      AUTHORITY_HOST_URL: 'https://login.microsoftonline.com',
      CRM_URL_PATH: '/api/data/v9.1/',
      CLIENT_ID: 'test',
      CLIENT_SECRET: 'test',
      TENANT_ID: 'test',
      TOKEN_PATH: '/oauth2/token',

      CRM_SIGNING_SECRET: 'test',
      NYCID_CONSOLE_PASSWORD: 'test',
    });

    // mock the crm endpoint and make available to the full scope of these tests
    scope = nock('https://dcppfsuat2.crm9.dynamics.com');

    // mock a dummy contact throughout
    scope
      .get(uri => uri.includes('api/data/v9.1/contacts'))
      .times(2)
      .reply(200, {
        value: [{
          contactid: 'test',
          emailaddress1: 'labs_dl@planning.nyc.gov',
        }], '@odata.context': ''
      })
      .persist();

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    restoreEnv();

    nock.restore();
  });

  it('runs', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200);
  });

  describe('Users resource', () => {
    it('/users is authenticated', async () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });

    it('gets a user record when authenticated', async () => {
      const server = app.getHttpServer();
      const token = extractJWT(await doLogin(server, request));

      return request(server)
        .get('/users')
        .set('Cookie', token)
        .expect(200);
    });
  });

  describe('Projects', () => {
    describe('Filtering and searching', () => {
    });

    describe('Details /:id', () => {
      test.todo('sideloads related actions, milestones, dispos')
    });

    describe('Downloads', () => {
      test.todo('responds to requests for shapefile');
      test.todo('responds to requests for csv');
      test.todo('responds to requests for geojson');
      test.todo('handles zero record queries for csvs');
    });
  });

  describe('LUPP Dashboard — User assignments', () => {
    test.todo('prevents unauthorized access to /assignments');

    test('allows for a "tab" query param', async () => {
      const server = app.getHttpServer();
      const token = extractJWT(await doLogin(server, request));

      scope
        .get(uri => uri.includes('api/data/v9.1/dcp_projects'))
        .reply(200, { value: [], '@odata.context': '' });

      return request(server)
        .get('/assignments?include=project.milestones%2Cproject.dispositions%2Cproject.actions&tab=to-review')
        .set('Cookie', token)
        .expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
