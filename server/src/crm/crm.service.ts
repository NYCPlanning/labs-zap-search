import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { ADAL } from "../_utils/adal";
import { ORequest } from "odata";
import * as superagent from "superagent";
import { dateParser } from "./crm.utilities";

// custom parser for json data. instantiates javascript date objects for date-like json strings
// code cribbed from https://github.com/visionmedia/superagent/issues/986#issuecomment-218435902
superagent.parse["application/json"] = function parseJSON(res, fn) {
  res.text = "";
  res.setEncoding("utf8");
  res.on("data", function(chunk) {
    res.text += chunk;
  });
  res.on("end", function() {
    let body, err;

    try {
      body = res.text && JSON.parse(res.text, dateParser);
    } catch (e) {
      err = e;
      // return the raw response if the response parsing fails
      err.rawResponse = res.text || null;

      // return the http status code if the response parsing fails
      err.statusCode = res.status;
    } finally {
      fn(err, body);
    }
  });
};

/**
 * This service is responsible for providing convenience
 * methods for interacting with CRM.
 */
@Injectable()
export class CrmService {
  crmUrlPath = "";
  crmHost = "";
  host = "";
  ADAL = ADAL;
  xml = {};

  constructor(private readonly config: ConfigService) {
    this.ADAL.ADAL_CONFIG = {
      CRMUrl: this.config.get("CRM_HOST"),
      webAPIurl: this.config.get("CRM_URL_PATH"),
      clientId: this.config.get("CLIENT_ID"),
      clientSecret: this.config.get("CLIENT_SECRET"),
      tenantId: this.config.get("TENANT_ID"),
      authorityHostUrl: this.config.get("AUTHORITY_HOST_URL"),
      tokenPath: this.config.get("TOKEN_PATH")
    };

    this.crmUrlPath = this.config.get("CRM_URL_PATH");
    this.crmHost = this.config.get("CRM_HOST");
    this.host = `${this.crmHost}${this.crmUrlPath}`;
  }

  async getToken() {
    return await this.ADAL.acquireToken();
  }

  async generateDefaultHeaders(crmPreferences = []) {
    const token = await this.getToken();
    const DEFAULT_CRM_PREFERENCES = [
      'odata.include-annotations="OData.Community.Display.V1.FormattedValue"'
    ];

    return {
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
      Accept: "application/json",
      Prefer: [...DEFAULT_CRM_PREFERENCES, ...crmPreferences]
    };
  }

  async get(entity: string, query: string) {
    // These may only be used against GET request to CRM.
    const ODATA_PREFERENCES = [
      'odata.include-annotations="*"',
      "odata.maxpagesize=500"
    ];

    try {
      const sanitizedQuery = query.replace(/^\s+|\s+$/g, "");
      const defaultHeaders = await this.generateDefaultHeaders(
        ODATA_PREFERENCES
      );
      const { body } = await superagent
        .get(`${this.host}${entity}?${sanitizedQuery}`)
        .set(defaultHeaders);
      const {
        value: records,
        "@odata.nextLink": nextPage = "",
        "@odata.count": count
      } = body;

      return {
        count,
        records,
        skipTokenParams: nextPage.split("?")[1]
      };
    } catch (e) {
      console.log(e);
      throw new HttpException(
        {
          code: "QUERY_FAILED",
          title: "Could not find entity",
          detail: e
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  async query(entity: string, query: string) {
    return await this.get(entity, query);
  }

  async update(entitySetName, guid, data) {
    return this._sendPatchRequest(`${entitySetName}(${guid})`, data);
  }

  async _sendPatchRequest(query, data) {
    const defaultHeaders = await this.generateDefaultHeaders([
      'odata.include-annotations="*"'
    ]);
    const { body } = await superagent
      .patch(`${this.host}${query}`)
      .send(data)
      .set(defaultHeaders);

    return body;
  }

  // TODO: Remove object-driven query templating
  async queryFromObject(entity: string, query: any, ...options) {
    const queryStringForEntity = this.serializeToQueryString(query);

    return await this.query(entity, queryStringForEntity);
  }

  // TODO: Remove object-driven query templating
  serializeToQueryString(query: any) {
    const truthyKeyedObject = Object.keys(query).reduce((acc, curr) => {
      if (query[curr]) {
        acc[curr] = query[curr];
      }

      return acc;
    }, {});
    const oDataReq = new ORequest(this.config.get("CRM_HOST"), {});

    oDataReq.applyQuery(truthyKeyedObject);

    const {
      url: { search }
    } = oDataReq;

    return search.split("?")[1];
  }
}
