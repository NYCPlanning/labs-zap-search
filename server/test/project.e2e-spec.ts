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

describe('Project Get', () => {
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
  test('Get correct project keys', async () => {
    const server = app.getHttpServer(); // UAT2 server
    const token = extractJWT(await doLogin(server, request)); // token that is passed with each request

    return request(server)
      .get('/projects?include=project.milestones%2Cproject.dispositions%2Cproject.actions')
      .set('Cookie', token)
      .expect(200)
      .then(async response => {
        const [project] = await response.body.data;

        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('type', 'projects');
        expect(project).toHaveProperty('attributes.applicants');
        expect(project).toHaveProperty('attributes.center');
        expect(project).toHaveProperty('attributes.dcp-borough');
        expect(project).toHaveProperty('attributes.dcp-ceqrnumber');
        expect(project).toHaveProperty('attributes.dcp-ceqrtype');
        expect(project).toHaveProperty('attributes.dcp-certifiedreferred');
        expect(project).toHaveProperty('attributes.dcp-communitydistricts');
        expect(project).toHaveProperty('attributes.dcp-femafloodzonea');
        expect(project).toHaveProperty('attributes.dcp-femafloodzonecoastala');
        expect(project).toHaveProperty('attributes.dcp-femafloodzoneshadedx');
        expect(project).toHaveProperty('attributes.dcp-femafloodzonev');
        expect(project).toHaveProperty('attributes.dcp-name');
        expect(project).toHaveProperty('attributes.dcp-projectbrief');
        expect(project).toHaveProperty('attributes.dcp-projectname');
        expect(project).toHaveProperty('attributes.dcp-publicstatus-simp');
        expect(project).toHaveProperty('attributes.dcp-ulurp-nonulurp');
        expect(project).toHaveProperty('attributes.has-centroid');
        expect(project).toHaveProperty('attributes.lastmilestonedate');
        expect(project).toHaveProperty('attributes.ulurpnumbers');
      });
  }, 60000);
});
