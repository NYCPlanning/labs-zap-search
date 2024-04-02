import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import mockedEnv from "mocked-env";
import nock from "nock";
import { doLogin } from "./helpers/do-login";
import { extractJWT } from "./helpers/extract-jwt";
import { AppModule } from "./../src/app.module";
import { SharepointService } from "src/sharepoint/sharepoint.service";
import { SharepointServiceMock } from "./helpers/sharepoint.service.mock";

describe("Disposition Patch", () => {
  let app;
  let restoreEnv;
  let scope;

  beforeAll(async () => {
    // Mocks the login handshake with CRM which allows Web API requests
    nock("https://login.microsoftonline.com")
      .post(uri => uri.includes("oauth2/token"))
      .reply(200, {
        token_type: "Bearer",
        expires_in: "3600",
        ext_expires_in: "3600",
        expires_on: "1573159181",
        not_before: "1573155281",
        resource: "https://dcppfsuat2.crm9.dynamics.com",
        access_token: "test"
      })
      .persist();

    // Mocks the local environment with dummy data so the app can boot
    restoreEnv = mockedEnv({
      CRM_HOST: "https://dcppfsuat2.crm9.dynamics.com",
      AUTHORITY_HOST_URL: "https://login.microsoftonline.com",
      CRM_URL_PATH: "/api/data/v9.1/",
      CLIENT_ID: "test",
      CLIENT_SECRET: "test",
      TENANT_ID: "test",
      TOKEN_PATH: "/oauth2/token",
      SHAREPOINT_CLIENT_ID: "test",
      SHAREPOINT_CLIENT_SECRET: "test",
      SHAREPOINT_SITE_ID: "test",

      CRM_SIGNING_SECRET: "test",
      NYCID_CONSOLE_PASSWORD: "test"
    });

    // mock the crm endpoint and make available to the full scope of these tests
    scope = nock("https://dcppfsuat2.crm9.dynamics.com");

    // mock a dummy contact throughout
    scope
      .get(uri => uri.includes("api/data/v9.1/contacts"))
      .times(2)
      .reply(200, {
        value: [
          {
            contactid: "test",
            emailaddress1: "labs_dl@planning.nyc.gov"
          }
        ],
        "@odata.context": ""
      })
      .persist();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(SharepointService)
      .useValue(SharepointServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    restoreEnv();
  });

  test("User can submit disposition", async () => {
    const server = app.getHttpServer();
    const token = extractJWT(await doLogin(server, request));

    scope
      .get(uri => uri.includes("api/data/v9.1/dcp_communityboarddispositions"))
      .reply(200, {
        value: [
          {
            // this needs to match the contactid of the current user
            _dcp_recommendationsubmittedby_value: "test"
          }
        ],
        "@odata.context": ""
      })
      .persist();

    scope
      .patch(uri =>
        uri.includes("api/data/v9.1/dcp_communityboarddispositions")
      )
      .reply(204, { value: [], "@odata.context": "" })
      .persist();

    return request(server)
      .patch("/dispositions/472fc5a1-9844-e811-813d-1458d04d0698")
      .set("Cookie", token)
      .send({
        data: {
          type: "dispositions",
          id: "472fc5a1-9844-e811-813d-1458d04d0698",
          attributes: {
            dcp_publichearinglocation: "test location"
          }
        }
      })
      .expect(200);
  });

  test("It requires authentication", async () => {
    const server = app.getHttpServer();

    return request(server)
      .patch("/dispositions/472fc5a1-9844-e811-813d-1458d04d0698")
      .expect(401);
  });
});
