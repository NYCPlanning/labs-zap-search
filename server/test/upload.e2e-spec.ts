import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import * as nock from 'nock';
import * as rootPath from 'app-root-path';
import * as fs from 'fs';
import { doLogin } from './helpers/do-login';
import { extractJWT } from './helpers/extract-jwt';
import { AppModule } from './../src/app.module';

describe('Document Upload', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
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
      .get(uri => uri.includes('api/data/v9.1/dcp_communityboarddispositions'))
      .reply(200, '1f8b08000000000004008c90cf4ef33010c45f2532df01a4c6ffc247eb9caa965bd50b172428428ebd014b711cc59b8a0af5ddd948c011b858b26667677ff3ced6c95bb4dca51ee10d59cd5e11875c0be1dd30b479b2a8b91ba3e1fed4db185ca6d128ec10c4ec1347c395f81701edfcbd20d333e971ea039e9a6447ef431e520e18529f2f7f94835fcc3aa5c0155bb0f53eb831e5d422bffd8adedeed3926b4dd082e8ddea5a9a7934bf5f7e92ec440a00ec08367756bbb0c0b76b4dd04ac7efcae83785ea88b7b71604a69b9bcd1faff81d155bf1090a75a36cb95b96e4a03ad29c128555ad3b8524ae5fdaa922b68d5e7a219951c5a6ab9934aaba22c1eb6f46c76c5765315053b3f9d3f0600ceb6d405a2010000', {
        'Content-Encoding': 'gzip',
      })
      .persist();

    scope
      .get(uri => uri.includes('api/data/v9.1/dcp_projects'))
      .reply(200, '1f8b08000000000004008c8fcd4ec33010845f255a38b452127b9d407e4e454085847a29070e1421cbde80511247b1538150df1d17155438711c6b3eef371fb0b05a7a992adb7b7af350c38bf783ab19d36a181a37492f52357655aadf7bd919e542b56372306ccfb16d95223bedc8cb7d3c09d0d330da5752decd8e4240293eca467fa5fdf31c6258ac8c1aadb38d4fafbecf5cae57a9b75eb623293b6a65a73ee825f8ff766b3a134629224d1aea46b68e62d8ca7622a81f7ea607f7e7b0fb9e6d0051f0e21cf37203c1ea8f7fe8206679b49c5a6ffbe8624bfd44d16cb9bebebb99ffae9b700e1acace50949464852c12aa101359954dc2396a5d66bce47971c00edf0b2ef82d4781b07bdc7d0e000e5597419b010000', {
        'Content-Encoding': 'gzip',
      })
      .persist();

    scope
      .get(uri => uri.includes('api/data/v9.1/sharepointdocumentlocations'))
      .reply(200, [
        '1f8b0800000000000400',
        '8c8f3f4fc33010c5bf8b6100a9f19f504a9ca912ac2c2c0c94e1eabb504bb12f8a2f1508f5bbe30eb081184ff79edeeff7a9b68c20a00367a17751bd3a884ca53706c3340d650169759893d7f89121c5506a341998a239f7ccd16b672e13099ccf8b728099268e5990c39228cbc80124722e57bfff225eab95da3ec63073e141f4c3f7d6fdd3a3161618670a3c63e02557c6c6fd3f3dc614ab59204242d50f30165aa9238c0ba9fee5c7bf0abc55f967b353ceb56de7d7b776a72ad55fd4b5b0de6ff65deb6ce371f00d79e71af0601b6b1d6277633b7bb751a7d7d3d700d5a118f469010000'
      ], { 'Content-Encoding': 'gzip' })
      .persist();

    scope
      .post(uri => uri.includes('api/data/v9.1/UploadDocument'))
      .reply(204, {
        'Content': 'YnVmZmVy',
        'Entity': {
          '@odata.type': 'Microsoft.Dynamics.CRM.sharepointdocument',
          'locationid': '4b6b8210-9df9-e911-a9a0-001dd8308076',
          'title': 'test.txt'
        },
        'OverwriteExisting': true,
        'ParentEntityReference': {
          '@odata.type': 'Microsoft.Dynamics.CRM.dcp_project',
          'dcp_projectid': 'fe35128e-37a7-e911-a98f-001dd8308047'
        },
        'FolderPath': '',
      })
      .persist();
  });

  // beforeAll(() => {
  //   nock.recorder.rec({
  //     dont_print: true,
  //     output_objects: true,
  //   });
  // })

  // afterAll(() => {
  //   const nockCalls = nock.recorder.play();
  //   nock.restore();

  //   fs.writeFileSync(`${rootPath}/test/mocks.json`, JSON.stringify(nockCalls), 'utf8');
  // });

  // If this fails, it may be due to the disposition entity setup being changed in UAT2.
  // For example, if the disposition entity '37b7894b-9ef9-e911-a9bc-001dd8308ef1' is deleted, since this test uploads to that 
  // disposition entity. This test overwrites the file test.txt
  test('User can upload a single document to a Disposition `37b7894b-9ef9-e911-a9bc-001dd8308ef1`', async () => {
    const server = app.getHttpServer();
    const token = extractJWT(await doLogin(server, request));

    // mock a file that says "buffer"
    const file = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);

    return request(server)
      .post('/document')
      .type('form')
      .attach('file', file, 'test.txt')
      .field('instanceId', '37b7894b-9ef9-e911-a9bc-001dd8308ef1') // trailing spaces required
      .field('entityName', 'dcp_communityboarddisposition')
      .set('Cookie', token)
      .expect(200)
      .expect({ message: 'Uploaded document successfully.' });
    });

  test('User can upload a single pdf to a Disposition `2020K0121 - ZC - BK CB3  `', async () => {
    const server = app.getHttpServer();
    const token = extractJWT(await doLogin(server, request));

    return request(server)
      .post('/document')
      .type('form')
      .attach('file', './test/dummy_files/dummy.pdf')
      .field('instanceId', '37b7894b-9ef9-e911-a9bc-001dd8308ef1') // trailing spaces required
      .field('entityName', 'dcp_communityboarddisposition')
      .set('Cookie', token)
      .expect(200)
      .expect({ message: 'Uploaded document successfully.' });
    });

  test('User can upload a single Excel doc to a Disposition `2020K0121 - ZC - BK CB3  `', async () => {
    const server = app.getHttpServer();
    const token = extractJWT(await doLogin(server, request));

    return request(server)
      .post('/document')
      .type('form')
      .attach('file', './test/dummy_files/dummy.xlsx')
      .field('instanceId', '37b7894b-9ef9-e911-a9bc-001dd8308ef1') // trailing spaces required
      .field('entityName', 'dcp_communityboarddisposition')
      .set('Cookie', token)
      .expect(200)
      .expect({ message: 'Uploaded document successfully.' });
    });

  test('User can upload a single Word doc to a Disposition `2020K0121 - ZC - BK CB3  `', async () => {
    const server = app.getHttpServer();
    const token = extractJWT(await doLogin(server, request));

    return request(server)
      .post('/document')
      .type('form')
      .attach('file', './test/dummy_files/dummy.doc')
      .field('instanceId', '37b7894b-9ef9-e911-a9bc-001dd8308ef1') // trailing spaces required
      .field('entityName', 'dcp_communityboarddisposition')
      .set('Cookie', token)
      .expect(200)
      .expect({ message: 'Uploaded document successfully.' });
    });

  test('It requires authentication', async () => {
    const server = app.getHttpServer();

    return request(server)
      .post('/document')
      .type('form')
      .attach('file', './test/dummy_files/dummy.doc')
      .field('instanceId', '37b7894b-9ef9-e911-a9bc-001dd8308ef1') // trailing spaces required
      .field('entityName', 'dcp_communityboarddisposition')
      .expect(401);
  });
});
