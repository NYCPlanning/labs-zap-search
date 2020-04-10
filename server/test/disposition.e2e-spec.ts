import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import * as nock from 'nock';
import * as rootPath from 'app-root-path';
import * as fs from 'fs';
import { doLogin } from './helpers/do-login';
import { extractJWT } from './helpers/extract-jwt';
import { AppModule } from './../src/app.module';
import { Disposition } from './../src/disposition/disposition.entity';

class DispoMock {
  update() {} // noop

  findOneOrFail() {
    return {
      // no idea where this id is coming from!
      // i believe it's the uat2 static test user
      dcp_recommendationsubmittedby: '56b08864-500d-ea11-a9a9-001dd83080ab',
    };
  }
}

describe('Disposition Patch', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
      .overrideProvider(getRepositoryToken(Disposition))
      .useValue(new DispoMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(() => {
    nock('https://login.microsoftonline.com:443')
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

    const scope = nock('https://dcppfsuat2.crm9.dynamics.com:443');

    scope
      .patch(uri => uri.includes('api/data/v9.1/dcp_communityboarddispositions'))
      .reply(204, '1f8b08000000000004008c90cf4ef33010c45f2532df01a4c6ffc247eb9caa965bd50b172428428ebd014b711cc59b8a0af5ddd948c011b858b26667677ff3ced6c95bb4dca51ee10d59cd5e11875c0be1dd30b479b2a8b91ba3e1fed4db185ca6d128ec10c4ec1347c395f81701edfcbd20d333e971ea039e9a6447ef431e520e18529f2f7f94835fcc3aa5c0155bb0f53eb831e5d422bffd8adedeed3926b4dd082e8ddea5a9a7934bf5f7e92ec440a00ec08367756bbb0c0b76b4dd04ac7efcae83785ea88b7b71604a69b9bcd1faff81d155bf1090a75a36cb95b96e4a03ad29c128555ad3b8524ae5fdaa922b68d5e7a219951c5a6ab9934aaba22c1eb6f46c76c5765315053b3f9d3f0600ceb6d405a2010000', {
        'Content-Encoding': 'gzip',
      })
      .persist();
  });

  test('User can submit disposition', async () => {
    const server = app.getHttpServer();
    const token = extractJWT(await doLogin(server, request));

    return request(server)
      .patch('/dispositions/472fc5a1-9844-e811-813d-1458d04d0698')
      .set('Cookie', token)
      .send({
        data: {
          type: 'dispositions',
          id: '472fc5a1-9844-e811-813d-1458d04d0698',
          attributes: {
            dcp_publichearinglocation: "test location",
          },
        },
      })
      .expect(200)
  });

  test('It requires authentication', async () => {
    const server = app.getHttpServer();

    return request(server)
      .patch('/dispositions/472fc5a1-9844-e811-813d-1458d04d0698')
      .expect(401);
  });
});
