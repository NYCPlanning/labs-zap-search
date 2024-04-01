import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { doLogin } from "./helpers/do-login";
import { extractJWT } from "./helpers/extract-jwt";
import { AppModule } from "./../src/app.module";
import * as nock from "nock";
import * as mockedEnvPkg from "mocked-env";
import * as fs from "fs";
import * as rootPath from "app-root-path";

const { default: mockedEnv } = mockedEnvPkg;

describe("Assignment Get", () => {
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
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(() => restoreEnv());

  // NOTE: this test is actually hitting the database. it maybe fail due to a timeout.
  // if this happens rerun the test. in the long-run, get a real test database!
  test("Get correct assignment keys", async () => {
    const server = app.getHttpServer();
    const token = extractJWT(await doLogin(server, request)); // token that is passed with each request

    const crmAssignmentsIsh = fs
      .readFileSync(
        `${rootPath}/test/test-data/crm-projects-with-lup-teams.json`
      )
      .toString();

    scope
      .get(uri => uri.includes("api/data/v9.1/dcp_projects"))
      .reply(200, {
        value: JSON.parse(crmAssignmentsIsh),
        "@odata.context": ""
      });

    return request(server)
      .get("/assignments?tab=reviewed")
      .set("Cookie", token)
      .expect(200)
      .then(async response => {
        const [assignment] = await response.body.data;

        expect(assignment).toHaveProperty("id");
        expect(assignment).toHaveProperty("relationships");
        expect(assignment).toHaveProperty("type", "assignments");
        expect(assignment).toHaveProperty("attributes.dcp-lupteammemberrole");
        expect(assignment).toHaveProperty("attributes.tab", "reviewed");

        const relationships = await response.body.data[0].relationships;

        expect(relationships).toHaveProperty("dispositions");
        expect(relationships).toHaveProperty("milestones");
        expect(relationships).toHaveProperty("project");
      });
  }, 30000);

  test("It requires authentication", async () => {
    const server = app.getHttpServer();

    return request(server)
      .get("/assignments?tab=upcoming")
      .expect(401);
  });
});
