import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import * as nock from 'nock';
import * as rootPath from 'app-root-path';
import * as fs from 'fs';
import { doLogin } from './helpers/do-login';
import { extractJWT } from './helpers/extract-jwt';
import { AppModule } from './../src/app.module';
import { ContactService } from './../src/contact/contact.service';
import { ConfigService } from './../src/config/config.service';

describe('Login', () => {
  let app;
  let contactMock;
  let configMock;

  beforeAll(async () => {
    contactMock = new class {
      findByEmail() {}
    };

    configMock = new ConfigService('test.env');

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
      .overrideProvider(ContactService)
      .useValue(contactMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('runs /login without token and gives an error', () => {
    return request(app.getHttpServer())
      .get('/login')
      .expect(401);
  });

  it('runs /login with accessToken and provides a new token', () => {
    jest.spyOn(contactMock, 'findByEmail').mockImplementation(() => ({ contactid: 'foo' }));

    return doLogin(app.getHttpServer(), request)
      .expect(200)
      .expect({ message: 'Login successful!' });
  });

  it('runs /login with accessToken and throws correct error if email not found in DB', () => {
    jest.spyOn(contactMock, 'findByEmail').mockImplementation(() => {
      throw new Error('Not found');
    });

    return doLogin(app.getHttpServer(), request)
      .expect(401);
  });
});
