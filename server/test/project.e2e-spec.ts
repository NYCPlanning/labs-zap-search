import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import * as mockedEnvPkg from "mocked-env";
import * as nock from "nock";
import { doLogin } from "./helpers/do-login";
import { extractJWT } from "./helpers/extract-jwt";
import { AppModule } from "./../src/app.module";

const { default: mockedEnv } = mockedEnvPkg;

describe("Project Get", () => {
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

  afterAll(async () => {
    restoreEnv();
  });

  test("Get correct project keys", async () => {
    scope
      .get(uri => uri.includes("api/data/v9.1/dcp_projects"))
      .reply(200, {
        value: [
          {
            "@odata.etag": 'W/"142292849"',
            dcp_name: "2018K0500",
            "dcp_applicanttype@OData.Community.Display.V1.FormattedValue":
              "Private",
            dcp_applicanttype: 717170002,
            "dcp_borough@OData.Community.Display.V1.FormattedValue": "Brooklyn",
            dcp_borough: 717170002,
            dcp_ceqrnumber: "19DCP128K",
            "dcp_ceqrtype@OData.Community.Display.V1.FormattedValue":
              "Unlisted",
            dcp_ceqrtype: 717170002,
            "dcp_certifiedreferred@OData.Community.Display.V1.FormattedValue":
              "4/16/2020",
            dcp_certifiedreferred: "2020-04-16T14:12:50.000Z",
            "dcp_femafloodzonea@OData.Community.Display.V1.FormattedValue":
              "No",
            dcp_femafloodzonea: false,
            "dcp_femafloodzoneshadedx@OData.Community.Display.V1.FormattedValue":
              "No",
            dcp_femafloodzoneshadedx: false,
            "dcp_sisubdivision@OData.Community.Display.V1.FormattedValue": "No",
            dcp_sisubdivision: false,
            "dcp_sischoolseat@OData.Community.Display.V1.FormattedValue": "No",
            dcp_sischoolseat: false,
            dcp_projectbrief: "Really great spot.",
            dcp_projectname: "999999999 5th Avenue Rezoning",
            "dcp_publicstatus@OData.Community.Display.V1.FormattedValue":
              "Filed",
            dcp_publicstatus: 717170000,
            dcp_projectcompleted: null,
            "dcp_hiddenprojectmetrictarget@OData.Community.Display.V1.FormattedValue":
              "450 Days",
            dcp_hiddenprojectmetrictarget: 717170000,
            "dcp_ulurp_nonulurp@OData.Community.Display.V1.FormattedValue":
              "ULURP",
            dcp_ulurp_nonulurp: 717170001,
            dcp_validatedcommunitydistricts: "K10",
            dcp_bsanumber: null,
            dcp_wrpnumber: null,
            dcp_lpcnumber: null,
            dcp_nydospermitnumber: null,
            "dcp_lastmilestonedate@OData.Community.Display.V1.FormattedValue":
              "4/16/2020",
            dcp_lastmilestonedate: "2020-04-16T14:13:04.000Z",
            "_dcp_applicant_customer_value@OData.Community.Display.V1.FormattedValue":
              "Some Customer",
            _dcp_applicant_customer_value:
              "09b7cd4b-c7b6-e811-814a-1458d04d95c0",
            "_dcp_applicantadministrator_customer_value@OData.Community.Display.V1.FormattedValue":
              "Some Other Customer",
            _dcp_applicantadministrator_customer_value:
              "a405c046-1133-e811-8126-1458d04dc8c8",
            dcp_projectid: "ad130a3b-ac70-e811-8136-1458d04d95c0"
          }
        ],
        "@odata.context": ""
      });

    const server = app.getHttpServer(); // UAT2 server
    const token = extractJWT(await doLogin(server, request)); // token that is passed with each request

    return request(server)
      .get("/projects")
      .set("Cookie", token)
      .expect(200)
      .then(async response => {
        const [project] = await response.body.data;

        expect(project).toHaveProperty("id");
        expect(project).toHaveProperty("type", "projects");
        expect(project).toHaveProperty("attributes.applicants");
        expect(project).toHaveProperty("attributes.dcp-borough");
        expect(project).toHaveProperty("attributes.dcp-ceqrnumber");
        expect(project).toHaveProperty("attributes.dcp-ceqrtype");
        expect(project).toHaveProperty("attributes.dcp-certifiedreferred");
        expect(project).toHaveProperty("attributes.dcp-communitydistricts");
        expect(project).toHaveProperty("attributes.dcp-femafloodzonea");
        expect(project).toHaveProperty("attributes.dcp-femafloodzoneshadedx");
        expect(project).toHaveProperty("attributes.dcp-name");
        expect(project).toHaveProperty("attributes.dcp-projectbrief");
        expect(project).toHaveProperty("attributes.dcp-projectname");
        expect(project).toHaveProperty("attributes.dcp-publicstatus");
        expect(project).toHaveProperty("attributes.dcp-ulurp-nonulurp");
      });
  }, 60000);
});
