import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import * as nock from 'nock';
import * as rootPath from 'app-root-path';
import * as fs from 'fs';
import { doLogin } from './helpers/do-login';
import { extractJWT } from './helpers/extract-jwt';
import { AppModule } from './../src/app.module';
import { Project } from './../src/project/project.entity';
import { strict as assert } from 'assert';

describe('Assignment Get', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // NOTE: this test is actually hitting the database. it maybe fail due to a timeout.
  // if this happens rerun the test. in the long-run, get a real test database!
  test('Get correct assignment keys', async () => {
    const server = app.getHttpServer();
    const token = extractJWT(await doLogin(server, request)); // token that is passed with each request

    return request(server)
      .get('/assignments?include=project.milestones%2Cproject.dispositions%2Cproject.actions&tab=upcoming')
      .set('Cookie', token)
      .expect(200)
      .then(async response => {
        const [assignment] = await response.body.data;

        expect(assignment).toHaveProperty('id')
        expect(assignment).toHaveProperty('relationships')
        expect(assignment).toHaveProperty('type', 'assignments')
        expect(assignment).toHaveProperty('attributes.dcp-lupteammemberrole')
        expect(assignment).toHaveProperty('attributes.tab', 'upcoming')

        const relationships = await response.body.data[0].relationships;

        expect(relationships).toHaveProperty('dispositions')
        expect(relationships).toHaveProperty('milestones')
        expect(relationships).toHaveProperty('project')
      });
  }, 30000);

  test('It requires authentication', async () => {
    const server = app.getHttpServer();

    return request(server)
      .get('/assignments?include=project.milestones%2Cproject.dispositions%2Cproject.actions&tab=upcoming')
      .expect(401);
  });
});
