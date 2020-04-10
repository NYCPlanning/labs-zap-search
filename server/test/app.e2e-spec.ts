import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { doLogin } from './helpers/do-login';
import { extractJWT } from './helpers/extract-jwt';

describe('AppController (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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

    describe('Map tiles', () => {
    });

    describe('Details /:id', () => {
      test.todo('sideloads related actions, milestones, dispos')
    });

    describe('Geometry updates', () => {
      test.todo('should respond with failure if id does not meet regex requirements');
      test.todo('should respond failure message if project does not have BBLs');
      test.todo('should respond success message if project is updated');
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
