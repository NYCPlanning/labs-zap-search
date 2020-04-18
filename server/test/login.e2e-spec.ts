import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import * as mockedEnvPkg from 'mocked-env';
import { doLogin } from './helpers/do-login';
import { AppModule } from './../src/app.module';
import { ContactService } from './../src/contact/contact.service';

const { 'default': mockedEnv } = mockedEnvPkg;

describe('Login', () => {
  let app;
  let contactMock;
  let restoreEnv;

  beforeAll(async () => {
    contactMock = new class {
      findByEmail() {}
    };

    restoreEnv = mockedEnv({
      NYCID_CONSOLE_PASSWORD: 'test',
      CRM_SIGNING_SECRET: 'test',
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
      .overrideProvider(ContactService)
      .useValue(contactMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    restoreEnv();
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
