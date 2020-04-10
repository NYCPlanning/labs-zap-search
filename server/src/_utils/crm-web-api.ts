import * as zlib from 'zlib';
import * as request from 'request';
import { ADAL } from './adal';

export const CRMWebAPI = {
  webAPIurl: 'process.env.webAPIurl',
  CRMUrl: 'process.env.CRMUrl',
  host() {
    return `${this.CRMUrl}${this.webAPIurl}`;
  },

  dateReviver: function (key, value) {
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
  },

  parseErrorMessage: function (json) {
    if (json) {
      if (json.error) {
        return json.error;
      }
      if (json._error) {
        return json._error;
      }
    }
    return "Error";
  },

  fixLongODataAnnotations: function (dataObj) {
    const newObj = {};

    for (let name in dataObj) {
      const formattedValuePrefix = name.indexOf("@OData.Community.Display.V1.FormattedValue");
      const logicalNamePrefix = name.indexOf("@Microsoft.Dynamics.CRM.lookuplogicalname");
      const navigationPropertyPrefix = name.indexOf("@Microsoft.Dynamics.CRM.associatednavigationproperty");

      if (formattedValuePrefix >= 0) {
        const newName = name.substring(0, formattedValuePrefix);
        if(newName) newObj[`${newName}_formatted`] = dataObj[name];
      }

      else if (logicalNamePrefix >= 0) {
        const newName = name.substring(0, logicalNamePrefix);
        if(newName) newObj[`${newName}_logical`] = dataObj[name];
      }

      else if (navigationPropertyPrefix >= 0) {
        const newName = name.substring(0, navigationPropertyPrefix);
        if (newName) newObj[`${newName}_navigationproperty`] = dataObj[name];
      }

      else {
        newObj[name] = dataObj[name];
      }
    }

    return newObj;
  },

  get: async function (query, maxPageSize = 100, headers= {}): Promise<any> {
    //  get token
    const JWToken = await ADAL.acquireToken();
    const PreferHeaderOptions = [
      'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
      'odata.include-annotations="*"',
      `odata.maxpagesize=${maxPageSize}`,
    ].join(',');

    const options = {
      url: `${this.host() + query}`,
      headers: {
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${JWToken}`,
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0',
        Accept: 'application/json',
        Prefer: PreferHeaderOptions,
        ...headers
      },
      encoding: null,
    };

    return new Promise((resolve, reject) => {
      request.get(options, (error, response, body) => {
        const encoding = response.headers['content-encoding'];

        if (!error && response.statusCode === 200) {
          // If response is gzip, unzip first

          const parseResponse = jsonText => {
            const json_string = jsonText.toString('utf-8');

            var result = JSON.parse(json_string, this.dateReviver);
            if (result["@odata.context"].indexOf("/$entity") >= 0) {
                // retrieve single
                result = this.fixLongODataAnnotations(result);
            }
            else if (result.value ) {
                // retrieve multiple
                var array = [];
                for (var i = 0; i < result.value.length; i++) {
                  array.push(this.fixLongODataAnnotations(result.value[i]));
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
            const result = JSON.parse(json_string, this.dateReviver);
            const err = this.parseErrorMessage(result);

            if (err == "Object reference not set to an instance of an object.") {
              this.get(query, maxPageSize, options)
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
  },

  sendPatchRequest: async function (query, data, headers) {
    //  get token
    const JWToken = await ADAL.acquireToken();
    const options = {
      url: `${this.host() + query }`,
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
      request.patch(options, (error, response, body) => {
        const encoding = response.headers['content-encoding'];

        if(error || response.statusCode != 204){
          const parseError = jsonText => {
            const json_string = jsonText.toString('utf-8');
            var result = JSON.parse(json_string, this.dateReviver);
            var err = this.parseErrorMessage(result);
            reject(err);
          };
          if (encoding && encoding.indexOf('gzip') >= 0) {
            zlib.gunzip(body, (err, dezipped) => {
              parseError(dezipped);
            });
          }
          else{
            parseError(body);

          }
        }
        else resolve();
      })
    });
  },

  create: async function (query, data, headers) {
    //  get token
    const JWToken = await ADAL.acquireToken();
    const options = {
      url: `${this.host() + query }`,
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
      request.post(options, (error, response, body) => {
        const encoding = response.headers['content-encoding'];
        if(error || (response.status != 200 && response.status != 204 && response.status != 1223)){
          const parseError = jsonText => {
            // Bug: sometimes CRM returns 'object reference' error
            // Fix: if we retry error will not show again
            const json_string = jsonText.toString('utf-8');
            var result = JSON.parse(json_string, this.dateReviver);
            var err = this.parseErrorMessage(result);
            reject(err);
          };
          if (encoding && encoding.indexOf('gzip') >= 0) {
            zlib.gunzip(body, (err, dezipped) => {
              parseError(dezipped);
            });
          }
          else{
            parseError(body);

          }
        }
        else if (response.status === 200) {
          const parseResponse = jsonText => {
            const json_string = jsonText.toString('utf-8');
            var result = JSON.parse(json_string, this.dateReviver);
            resolve(result);
          };

          if (encoding && encoding.indexOf('gzip') >= 0) {
            zlib.gunzip(body, (err, dezipped) => {
              parseResponse(dezipped);
            });
          }
          else{
            parseResponse(body);
          }
        }
        else if(response.status === 204 || response.status === 1223){
          const uri = response.headers.get("OData-EntityId");
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
        else{
          resolve();
        }
      });
    })
  },

  sendDeleteRequest: async function (query, headers) {
    // get token
    const JWToken = await ADAL.acquireToken();
    const options = {
      url: `${this.host() + query }`,
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
      request.patch(options, (error, response, body) => {
        const encoding = response.headers['content-encoding'];
        if(error || (response.status != 204 && response.status != 1223)){
          const parseError = jsonText => {
            const json_string = jsonText.toString('utf-8');
            const result = JSON.parse(json_string, this.dateReviver);
            const err = this.parseErrorMessage(result);
            reject(err);
          };
          if (encoding && encoding.indexOf('gzip') >= 0) {
            zlib.gunzip(body, (err, dezipped) => {
              parseError(dezipped);
            });
          }
          else{
            parseError(body);

          }
        }
        else resolve();
      })
    });
  },

  /**
   * Finds location id for folder for specific instance of an entity
   * @param { GUID } entityID - a 32 character id, in format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   * @param { string } folderName - Instance folder name, which usually has the format
   * '<entity.dcp_name>_<entity.dcp_[entity]id>'. Note that whitespace SHOULD NOT* be trimmed off of
   * dcp_name.
   * *Should not because we still need to more thoroughly verify this.
   * e.g. '2018Q0147 - Tax Map(s) - 1_D2A818330BF0E911A997001DD832112G'
  */
  findDocumentLocation: function (entityID, folderName) {
    const fetchDocumentLocationXML = [
      `<fetch mapping="logical" distinct="true" top="1">`,
      `<entity name="sharepointdocumentlocation">`,
      `<attribute name="sharepointdocumentlocationid"/>`,
      `<filter type="and">`,
      `<condition attribute="regardingobjectid" operator="eq" value="${entityID}"/>`,
      `<condition attribute="locationtype" operator="eq" value="0"/>`,
      `<condition attribute="servicetype" operator="eq" value="0"/>`,
      `<condition attribute="relativeurl" operator="eq" value="${folderName}"/>`,
      `</filter>`,
      `</entity>`,
      `</fetch>`
    ].join('');

    return this.get(`sharepointdocumentlocations?fetchXml=${fetchDocumentLocationXML}`)
      .then((response:any) => {
        const documentLocations = response.value;
        if (documentLocations.length > 0) {
          return documentLocations[0];
        } else {
          return null;
        }
      })
  },

  /**
    * Finds folder for an entity (like `dcp_project` or `dcp_communityboarddisposition`).
    * Entity folders contain many instance folders, the paths of which can be
    * acquired instead via findDocumentLocation.
    * @param { GUID } entityName - name of CRM entity, like  `dcp_project` or `dcp_communityboarddisposition`.
    * @param { string } sharepointSiteID - ID of CRM's corresponding sharepoint site. Use getParentSiteLocation() to acquire this ID
  */
  findEntityDocumentLocation: function (entityName, sharepointSiteID) {
    const fetchDocumentLocationXML = [
      `<fetch mapping="logical" distinct="true" top="1">`,
      `<entity name="sharepointdocumentlocation">`,
      `<attribute name="name"/>`,
      `<filter type="and">`,
      `<condition attribute="parentsiteorlocation" operator="eq" value="${sharepointSiteID}"/>`,
      `<condition attribute="locationtype" operator="eq" value="0"/>`,
      `<condition attribute="servicetype" operator="eq" value="0"/>`,
      `<condition attribute="relativeurl" operator="eq" value="${entityName}"/>`,
      `</filter>`,
      `</entity>`,
      `</fetch>`
    ].join('');

    return this.get(`sharepointdocumentlocations?fetchXml=${fetchDocumentLocationXML}`)
      .then((response:any) => {
        const documentLocations = response.value;
        if (documentLocations.length > 0) {
          return documentLocations[0];
        } else {
          return null;
        }
      })
  },

  // Use to get ID of current CRM's corresponding sharepoint site ID,
  // i.e. "sharepointSiteID" required in findEntityDocumentLocation()
  getParentSiteLocation: async function () {
    const fetchParentSiteLocationIdXML = [
      `<fetch mapping="logical" distinct="false" top="1">`,
        `<entity name="sharepointsite">`,
          `<attribute name="name"/>`,
          `<attribute name="sitecollectionid"/>`,
          `<attribute name="isgridpresent"/>`,
          `<attribute name="absoluteurl"/>`,
          `<attribute name="isdefault"/>`,
          `<attribute name="folderstructureentity"/>`,
          `<filter type="and">`,
            `<condition attribute="isdefault" operator="eq" value="true"/>`,
            `<condition attribute="statecode" operator="eq" value="0"/>`,
          `</filter>`,
        `</entity>`,
      `</fetch>`
    ].join('');

    return this.get(`sharepointsites?fetchXml=${fetchParentSiteLocationIdXML}`)
      .then((response:any) => {
        const parentSiteLocations = response.value;
        if(parentSiteLocations.length > 0){
          return parentSiteLocations[0];
        }
        else{
          return null;
        }
      })
  },

  createDocumentLocation: async function (locationName, absURL, folderName, sharepointSiteID, parentEntityReference, headers) {

    //  get token
    const JWToken = await ADAL.acquireToken();

    const options = {
      url: `${this.host()}AddOrEditLocation`,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${JWToken}`,
        ...headers
      },
      body: JSON.stringify({
        "LocationName": locationName,
        "AbsUrl": absURL,
        "RelativePath": folderName,
        "ParentType": "sharepointsite",
        "ParentId": sharepointSiteID,
        "IsAddOrEditMode": true,
        "IsCreateFolder": true,
        "DocumentId": "",
        "ParentEntityReference": parentEntityReference,
      })
    };

    return new Promise((resolve, reject) => {
      request.post(options, (error, response, body) => {
        if(body){
          try{
            const jsonBody = JSON.parse(body);
            if(jsonBody.error){
              reject(this.parseErrorMessage(jsonBody));
            }
            else{
              resolve(jsonBody.LocationId);
            }
          }catch(error){
            reject(body);
          }
        }
        else{
          reject("Didn't get LocationID");
        }
      });
    });
  },


  /**
   * @param { string } entityName - (required) Entity name like `dcp_project` or `dcp_communityboarddisposition`
   * @param { string } entityID - (required) a 32 character id, in format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   * @param { string } folderName - (required) name of folder for entity instance. e.g '2018Q0147 - Tax Map(s) - 1_D2A818330BF0E911A997001DD832112G'
   * This needs to be constructed by attaching the instance `dcp_name` to a formatted instance guid
   * (for projects, it is `dcp_projectid`; for dispositions, it is `dcp_communityboarddispositionid`).
   * @param { string } fileName - Desired name of the file.
   * @param { string } base64File - base64 encoded buffer
   * @param { Boolean } overwriteExisting - Whether to overwrite existing file
   * @param { Object } headers - Object with key-value pairs to attach to the POST header. Should include the MSCRMCallerID.
   * The `entityID` and `folderName` parameters can be acquired and constructed by making separate requests to the API.
   */
  uploadDocument: async function (entityName, entityID, folderName, fileName, base64File, overwriteExisting, headers) {
    let docLocation = await this.findDocumentLocation(entityID, folderName);
    let docLocationID = null;

    if(!docLocation){
      const parentSiteLocation = await this.getParentSiteLocation();
      if(!parentSiteLocation) throw new Error('Sharepoint Site Location not found');
      const sharepointSiteID = parentSiteLocation['sharepointsiteid'];
      const entityDocLocation = await this.findEntityDocumentLocation(entityName, sharepointSiteID);
      if(!entityDocLocation) throw new Error('Entity Document Location not found');
      const entityDocName = entityDocLocation.name;
      const absoluteURL = `${parentSiteLocation['absoluteurl']}/${entityName}/${folderName}`;
      const entityRef = {
        "@odata.type": "Microsoft.Dynamics.CRM." + entityName,
      };
      entityRef[entityName+"id"] = entityID;

      docLocationID = await this.createDocumentLocation(entityDocName, absoluteURL, folderName, sharepointSiteID, entityRef, headers);
    } else {
      docLocationID = docLocation.sharepointdocumentlocationid;
    }

    //  get token
    const JWToken = await ADAL.acquireToken();

    const entityRef = {
      "@odata.type": "Microsoft.Dynamics.CRM." + entityName,
    };
    entityRef[entityName+"id"] = entityID;

    const options = {
        url: `${this.host()}UploadDocument`,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: `Bearer ${JWToken}`,
            ...headers
        },
        body: JSON.stringify({
          "Content": base64File,
          "Entity": {
            "@odata.type": "Microsoft.Dynamics.CRM.sharepointdocument",
            "locationid": docLocationID,
            "title": fileName
          },
          "OverwriteExisting": overwriteExisting,
          "ParentEntityReference": entityRef,
          "FolderPath": ""
        })
    };

      return new Promise((resolve, reject) => {
        request.post(options, (error, response, body) => {
          if (response.statusCode === 403) {
            resolve("Forbidden.");
          }
          if (response.statusCode === 204) {
            resolve("Uploaded document successfully.")
          }
          // If response body exists,
          // allow CRM error message to bubble up.
          if (body) {
            try {
              const jsonBody = JSON.parse(body);
              const parsedErrorMessage = this.parseErrorMessage(jsonBody);
              if (parsedErrorMessage) {
                // Nest was throwing server Errors on Promise.reject()?
                resolve(parsedErrorMessage);
              }
            } catch(error) {
              reject(body);
            }
          }
        });
      });
  },

  update: async function (entitySetName, guid, data, headers) {
    var query = entitySetName + "(" + guid + ")";
    return this.sendPatchRequest(query, data, headers);
  },

  delete: async function (entitySetName, guid, headers) {
    const query = entitySetName + "(" + guid + ")";
    return this.sendDeleteRequest(query, headers);
  },

  associate: async function (relationshipName, entitySetName1, guid1, entitySetName2, guid2, headers) {
    const query = entitySetName1 + "(" + guid1 + ")/" + relationshipName + "/$ref";
    const data = {
      "@odata.id": this.host() + entitySetName2 + "(" + guid2 + ")"
    };
    return this.create(query, data, headers);
  },

  disassociate: async function (relationshipName, entitySetName1, guid1, guid2, headers) {
    const query = entitySetName1 + "(" + guid1 + ")/" + relationshipName + "(" + guid2 + ")/$ref";
    return this.sendDeleteRequest(query, headers);
  },

  executeAction: async function (actionName, data, entitySetName, guid, headers) {
    let query = "";
    if (!entitySetName) query = actionName;
    else query = entitySetName + "(" + guid + ")/Microsoft.Dynamics.CRM." + actionName;
    return this.create(query, data, headers);
  },

  escape: function (str) {
    return str.replace(/'/g, "''");
  },
};
