import {
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import * as zlib from 'zlib';
import * as Request from 'request';
import { ConfigService } from '../config/config.service';
import { ADAL } from '../_utils/adal';

/**
 * This service is responsible for providing convenience
 * methods for interacting with CRM.
 * TODO: Leverage the oData service written by @allthesignals
 * See
 * https://github.com/NYCPlanning/labs-zap-api/blob/api-only/src/odata/odata.service.ts
 * https://github.com/NYCPlanning/labs-zap-api/blob/api-only/src/contact/contact.service.ts
 *
 * @class      CrmService (name)
 */
@Injectable()
export class CrmService {
  crmUrlPath = '';
  crmHost = '';
  host = '';

  constructor(
    private readonly config: ConfigService,
  ) {
    ADAL.ADAL_CONFIG = {
      CRMUrl: this.config.get('CRM_HOST'),
      webAPIurl: this.config.get('CRM_URL_PATH'),
      clientId: this.config.get('CLIENT_ID'),
      clientSecret: this.config.get('CLIENT_SECRET'),
      tenantId: this.config.get('TENANT_ID'),
      authorityHostUrl: this.config.get('AUTHORITY_HOST_URL'),
      tokenPath: this.config.get('TOKEN_PATH'),
    };

    this.crmUrlPath = this.config.get('CRM_URL_PATH');
    this.crmHost = this.config.get('CRM_HOST');
    this.host = `${this.crmHost}${this.crmUrlPath}`;
  }

  async get(entity: string, query: string, ...options) {
    try {
      const sanitizedQuery = query.replace(/^\s+|\s+$/g, '');
      const response = await this._get(`${entity}?${sanitizedQuery}`, ...options);
      const {
        value: records,
        '@odata.count': count,
      } = response;

      return {
        count,
        records,
      };
    } catch (e) {
      throw new HttpException({
        code: 'QUERY_FAILED',
        title: 'Could not find entity',
        detail: e,
      }, HttpStatus.NOT_FOUND);
    }
  }

  async create(query, data, headers = {}) {
    return this._create(query, data, headers);
  }

  async update(entity, guid, data, headers = {}) {
    return this._update(entity, guid, data, headers);
  }

  async delete(entitySetName, guid, headers = {}) {
    const query = entitySetName + "(" + guid + ")";

    return this._sendDeleteRequest(query, headers);
  }

  async associate(relationshipName, entitySetName1, guid1, entitySetName2, guid2, headers = {}) {
    return this._associate(relationshipName, entitySetName1, guid1, entitySetName2, guid2, headers);
  }

  /**
   * Makes a CRM Web API query using the passed in query in XML format
   *
   * @param      {string}  entity     the pluralized version of the entity
   * @param      {string}  xmlQuery   query string to additionally filter, in XML
   * @return     {string}
   */
  async getWithXMLQuery(entity: string, xmlQuery: string, ...options) {
    const response = await this._get(`${entity}?fetchXml=${xmlQuery}`, ...options);
    return response;
  }

  // this provides the formatted values but doesn't do it for top level
  // TODO: where should this happen? 
  _fixLongODataAnnotations(dataObj) {
    return dataObj;
  }

  _parseErrorMessage(json) {
    if (json) {
      if (json.error) {
        return json.error;
      }
      if (json._error) {
        return json._error;
      }
    }
    return "Error";
  }

  _dateReviver(key, value) {
    if (typeof value === 'string') {
      // YYYY-MM-DDTHH:mm:ss.sssZ => parsed as UTC
      // YYYY-MM-DD => parsed as local date

      if (value != "") {
        const a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);

        if (a) {
          const s = parseInt(a[6]);
          const ms = Number(a[6]) * 1000 - s * 1000;
          return new Date(Date.UTC(parseInt(a[1]), parseInt(a[2]) - 1, parseInt(a[3]), parseInt(a[4]), parseInt(a[5]), s, ms));
        }

        const b = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

        if (b) {
          return new Date(parseInt(b[1]), parseInt(b[2]) - 1, parseInt(b[3]), 0, 0, 0, 0);
        }
      }
    }

    return value;
  }

  async _get(query, maxPageSize = 100, headers = {}): Promise<any> {
    //  get token
    const JWToken = await ADAL.acquireToken();
    const options = {
      url: `${this.host}${query}`,
      headers: {
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${JWToken}`,
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0',
        Accept: 'application/json',
        Prefer: 'odata.include-annotations="*"',
        ...headers
      },
      encoding: null,
    };

    return new Promise((resolve, reject) => {
      Request.get(options, (error, response, body) => {
        const encoding = response.headers['content-encoding'];

        if (!error && response.statusCode === 200) {
          // If response is gzip, unzip first

          const parseResponse = jsonText => {
            const json_string = jsonText.toString('utf-8');

            var result = JSON.parse(json_string, this._dateReviver);
            if (result["@odata.context"].indexOf("/$entity") >= 0) {
              // retrieve single
              result = this._fixLongODataAnnotations(result);
            }
            else if (result.value) {
              // retrieve multiple
              var array = [];
              for (var i = 0; i < result.value.length; i++) {
                array.push(this._fixLongODataAnnotations(result.value[i]));
              }
              result.value = array;
            }
            resolve(result);
          };

          if (encoding && encoding.indexOf('gzip') >= 0) {
            zlib.gunzip(body, (err, dezipped) => {
              parseResponse(dezipped);
            });
          }
          else {
            parseResponse(body);
          }
        } else {
          const parseError = jsonText => {
            // Bug: sometimes CRM returns 'object reference' error
            // Fix: if we retry error will not show again
            const json_string = jsonText.toString('utf-8');
            const result = JSON.parse(json_string, this._dateReviver);
            const err = this._parseErrorMessage(result);

            if (err == "Object reference not set to an instance of an object.") {
              this._get(query, maxPageSize, options)
                .then(
                  resolve, reject
                );
            } else {
              reject(err);
            }
          };

          if (encoding && encoding.indexOf('gzip') >= 0) {
            zlib.gunzip(body, (err, dezipped) => {
              parseError(dezipped);
            });
          } else {
            parseError(body);
          }
        }
      });
    });
  }

  async _create(query, data, headers): Promise<any> {
    //  get token
    const JWToken = await ADAL.acquireToken();
    const options = {
      url: `${this.host + query}`,
      headers: {
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${JWToken}`,
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0',
        Accept: 'application/json',
        Prefer: 'return=representation',
        ...headers
      },
      body: JSON.stringify(data),
      encoding: null,
    };

    return new Promise((resolve, reject) => {
      Request.post(options, (error, response, body) => {
        const encoding = response.headers['content-encoding'];

        if (error || (response.statusCode != 200 && response.statusCode != 201 && response.statusCode != 204 && response.statusCode != 1223)) {
          const parseError = jsonText => {
            // Bug: sometimes CRM returns 'object reference' error
            // Fix: if we retry error will not show again
            const json_string = jsonText.toString('utf-8');

            var result = JSON.parse(json_string, this._dateReviver);
            var err = this._parseErrorMessage(result);
            reject(err);
          };
          if (encoding && encoding.indexOf('gzip') >= 0) {
            zlib.gunzip(body, (err, dezipped) => {
              parseError(dezipped);
            });
          }
          else {
            parseError(body);

          }
        }
        else if (response.statusCode === 200 || response.statusCode === 201) {
          const parseResponse = jsonText => {
            const json_string = jsonText.toString('utf-8');
            var result = JSON.parse(json_string, this._dateReviver);
            resolve(result);
          };

          if (encoding && encoding.indexOf('gzip') >= 0) {
            zlib.gunzip(body, (err, dezipped) => {
              parseResponse(dezipped);
            });
          }
          else {
            parseResponse(body);
          }
        }
        else if (response.statusCode === 204 || response.statusCode === 1223) {
          const uri = response.headers["OData-EntityId"];
          if (uri) {
            // create request - server sends new id
            const regExp = /\(([^)]+)\)/;
            const matches = regExp.exec(uri);
            const newEntityId = matches[1];
            resolve(newEntityId);
          }
          else {
            // other type of request - no response
            resolve();
          }
        }
        else {
          resolve();
        }
      });
    })
  }

  async _update(entitySetName, guid, data, headers) {
    var query = entitySetName + "(" + guid + ")";
    return this._sendPatchRequest(query, data, headers);
  }

  async _sendPatchRequest(query, data, headers) {
    //  get token
    const JWToken = await ADAL.acquireToken();
    const options = {
      url: `${this.host + query}`,
      headers: {
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${JWToken}`,
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0',
        Accept: 'application/json',
        Prefer: 'odata.include-annotations="*"',
        ...headers
      },
      body: JSON.stringify(data),
      encoding: null,
    };

    return new Promise((resolve, reject) => {
      Request.patch(options, (error, response, body) => {
        const encoding = response.headers['content-encoding'];

        if (error || response.statusCode != 204) {
          const parseError = jsonText => {
            const json_string = jsonText.toString('utf-8');
            var result = JSON.parse(json_string, this._dateReviver);
            var err = this._parseErrorMessage(result);
            reject(err);
          };
          if (encoding && encoding.indexOf('gzip') >= 0) {
            zlib.gunzip(body, (err, dezipped) => {
              parseError(dezipped);
            });
          }
          else {
            parseError(body);

          }
        }
        else resolve(body);
      })
    });
  }

  async _sendDeleteRequest(query, headers) {
    // get token
    const JWToken = await ADAL.acquireToken();
    const options = {
      url: `${this.host + query}`,
      headers: {
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${JWToken}`,
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0',
        Accept: 'application/json',
        Prefer: 'odata.include-annotations="*"',
        ...headers
      },
      encoding: null,
    };

    return new Promise((resolve, reject) => {
      Request.delete(options, (error, response, body) => {
        const encoding = response.headers['content-encoding'];

        if (error || (response.statusCode != 204 && response.statusCode != 1223)) {
          const parseError = jsonText => {
            const json_string = jsonText.toString('utf-8');
            const result = JSON.parse(json_string, this._dateReviver);
            const err = this._parseErrorMessage(result);
            reject(err);
          };
          if (encoding && encoding.indexOf('gzip') >= 0) {
            zlib.gunzip(body, (err, dezipped) => {
              parseError(dezipped);
            });
          }
          else {
            parseError(body);

          }
        }
        else resolve();
      })
    });
  }

  async _associate(relationshipName, entitySetName1, guid1, entitySetName2, guid2, headers) {
    const query = entitySetName1 + "(" + guid1 + ")/" + relationshipName + "/$ref";
    const data = {
      "@odata.id": this.host + entitySetName2 + "(" + guid2 + ")"
    };
    return this.create(query, data, headers);
  }

  async generateSharePointAccessToken(): Promise<any> {
    const TENANT_ID = this.config.get('TENANT_ID');
    const SHAREPOINT_CLIENT_ID = this.config.get('SHAREPOINT_CLIENT_ID');
    const SHAREPOINT_CLIENT_SECRET = this.config.get('SHAREPOINT_CLIENT_SECRET');
    const ADO_PRINCIPAL = this.config.get('ADO_PRINCIPAL');
    const SHAREPOINT_TARGET_HOST = this.config.get('SHAREPOINT_TARGET_HOST');

    const clientId = `${SHAREPOINT_CLIENT_ID}@${TENANT_ID}`;
    const data = `
      grant_type=client_credentials
      &client_id=${clientId}
      &client_secret=${SHAREPOINT_CLIENT_SECRET}
      &resource=${ADO_PRINCIPAL}/${SHAREPOINT_TARGET_HOST}@${TENANT_ID}
    `;

    const options = {
      url: `https://accounts.accesscontrol.windows.net/${TENANT_ID}/tokens/OAuth/2`,
      headers: {
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/x-www-form-urlencoded',
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0',
        Accept: 'application/json',
        Prefer: 'return=representation',
      },
      body: data,
      encoding: null,
    };

    return new Promise(resolve => {
      Request.get(options, (error, response, body) => {
        const stringifiedBody = body.toString('utf-8');
        if (response.statusCode >= 400) {
          console.log('error', stringifiedBody);
        }

        resolve(JSON.parse(stringifiedBody));
      });
    })
  }

  // Retrieves a list of files in a given Sharepoint folder
  async getSharepointFolderFiles(folderIdentifier): Promise<any> {
    try {
      const { access_token } = await this.generateSharePointAccessToken();
      const SHAREPOINT_CRM_SITE = this.config.get('SHAREPOINT_CRM_SITE');

      // Escape apostrophes by duplicating any apostrophes.
      // See https://sharepoint.stackexchange.com/a/165224
      const formattedFolderIdentifier = folderIdentifier.replace(/'/g, "''");
      const url = encodeURI(`https://nyco365.sharepoint.com/sites/${SHAREPOINT_CRM_SITE}/_api/web/GetFolderByServerRelativeUrl('/sites/${SHAREPOINT_CRM_SITE}/${formattedFolderIdentifier}')/Files`);

      const options = {
        url,
        headers: {
          'Authorization': `Bearer ${access_token}`,
          Accept: 'application/json',
        },
      };

      return new Promise(resolve => {
        Request.post(options, (error, response, body) => {
          const stringifiedBody = body.toString('utf-8');
          if (response.statusCode >= 400) {
            throw new HttpException({
              code: 'LOAD_FOLDER_FAILED',
              title: 'Error loading sharepoint files',
              detail: `Could not load file list from Sharepoint folder "${formattedFolderIdentifier}". ${stringifiedBody}`,
            }, HttpStatus.NOT_FOUND);
          }

          resolve(JSON.parse(stringifiedBody));
        });
      })
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException({
          code: 'REQUEST_FOLDER_FAILED',
          title: 'Error requesting sharepoint files',
          detail: `Error while constructing request for Sharepoint folder files`,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  /**
   * Uses the given url server relative url to create a request to the Sharepoint API
   * for respective file. Server relative urls have this format:
   *   /sites/<site>/<entity_name>/<folder_name>/filename.pdf
   * For example,
   *   /sites/dcpuat2/dcp_package/2021M0268_DraftEAS_1_996699F37323EB11A813001DD8309FA8/EAS%20Full%20Form.pdf
   * @param      {string}  serverRelativeUrl { server relative url }
   * @return     {stream}  { Returns a pipeable file stream }
   */
  async getSharepointFile(serverRelativeUrl): Promise<any> {
    const { access_token } = await this.generateSharePointAccessToken();
    const SHAREPOINT_CRM_SITE = this.config.get('SHAREPOINT_CRM_SITE');

    // see https://docs.microsoft.com/en-us/previous-versions/office/sharepoint-server/dn775742(v=office.15)
    const url = `https://nyco365.sharepoint.com/sites/${SHAREPOINT_CRM_SITE}/_api/web/GetFileByServerRelativeUrl('/${serverRelativeUrl}')/$value?binaryStringResponseBody=true`;

    const options = {
      url,
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    };

    // this returns a pipeable stream
    return Request.get(options)
      .on('error', (e) => console.log(e));
  }

  async deleteSharepointFile(serverRelativeUrl): Promise<any> {
    const { access_token } = await this.generateSharePointAccessToken();
    const SHAREPOINT_CRM_SITE = this.config.get('SHAREPOINT_CRM_SITE');
    const url = `https://nyco365.sharepoint.com/sites/${SHAREPOINT_CRM_SITE}/_api/web/GetFileByServerRelativeUrl('${serverRelativeUrl}')`;

    const options = {
      url,
      headers: {
        'Authorization': `Bearer ${access_token}`,
        Accept: 'application/json',
        'X-HTTP-Method': 'DELETE',
      },
    };

    return new Promise(resolve => {
      Request.del(options, (error, response, body) => {
        const stringifiedBody = body.toString('utf-8');
        if (response.statusCode >= 400) {
          console.log('error', stringifiedBody);
        }

        resolve();
      });
    })
  }
}
