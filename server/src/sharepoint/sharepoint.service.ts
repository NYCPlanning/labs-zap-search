import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import * as Request from "request";
import { ConfigService } from "../config/config.service";
import { MSAL, MsalProviderType } from '../provider/msal.provider';

/***
 * If Sharepoint returns a nested Folders array (see 'folders' argument example),
 * we recursively flatten it out to just an array of Files.
 * @param { folders } - Example:
 *  [{
 *   Files: [File Object, File Object],
 *   Folders: [{
 *        Files: [File Object, File Object],
 *        Folders: [
 *          ..etc
 *        ]
 *      }, {
 *        Files: [File Object, File Object],
 *        Folders: [
 *          ..etc
 *        ]
 *      }]
 *  }, ...]
 */
function unnest(folders = []) {
  return folders
    .map(folder => {
      return [...folder["Files"], ...unnest(folder["Folders"])];
    })
    .reduce((acc, curr) => {
      return acc.concat(curr);
    }, []);
}
export type SharePointListDrive = {
  name: string;
  drive: {
    id: string;
  };
};

export type SharepointFile = {
  id: string;
  name: string;
  createdDateTime: string;
  file?: {
    mimeType: string;
  };
  folder?: {
    childCount: number;
  };
};

// This service currently only helps you read and delete files from Sharepoint.
// If you wish to upload documents to Sharepoint through CRM,
// use the DocumentService instead.
@Injectable()
export class SharepointService {
  constructor(
    @Inject(MSAL)
    private readonly msalProvider: MsalProviderType,

    private readonly config: ConfigService,
  ) {}
  async generateSharePointAccessToken(): Promise<any> {
    const TENANT_ID = this.config.get("TENANT_ID");
    const SHAREPOINT_CLIENT_ID = this.config.get("SHAREPOINT_CLIENT_ID");
    const SHAREPOINT_CLIENT_SECRET = this.config.get(
      "SHAREPOINT_CLIENT_SECRET"
    );
    const ADO_PRINCIPAL = this.config.get("ADO_PRINCIPAL");
    const SHAREPOINT_TARGET_HOST = this.config.get("SHAREPOINT_TARGET_HOST");

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
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/x-www-form-urlencoded",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
        Accept: "application/json",
        Prefer: "return=representation"
      },
      body: data,
      encoding: null
    };

    return new Promise(resolve => {
      Request.get(options, (error, response, body) => {
        if (error) return;
        const stringifiedBody = body.toString("utf-8");
        if (response.statusCode >= 400) {
          console.log("error", stringifiedBody);
        }

        resolve(JSON.parse(stringifiedBody));
      });
    });
  }

  private async traverseFolders(
    driveId: string,
    folderName: string,
    accessToken: string,
  ): Promise<Array<SharepointFile>> {
    const url = `${this.msalProvider.sharePointSiteUrl}/drives/${driveId}/root:/${folderName}:/children?$select=id,name,file,folder,createdDateTime`;
    const options = {
      headers: {
        method: 'GET',
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    };
    const response = await fetch(url, options);
    const data = (await response.json()) as {
      value: Array<SharepointFile>;
    };
    let documents: Array<SharepointFile> = [];
    // Create a promise for each folder that needs to be search,
    // allowing child folders to be search simultaneously
    const pendingDocuments: Array<Promise<SharepointFile[]>> = [];
    const fileCount = data.value.length;

    for (let i = 0; i < fileCount; i++) {
      const entry = data.value[i];
      if (entry.file !== undefined) {
        documents.push(entry);
      } else if (entry.folder?.childCount > 0) {
        pendingDocuments.push(
          this.traverseFolders(
            driveId,
            `${folderName}/${entry.name}`,
            accessToken,
          ),
        );
      }
    }
    const resolvedDocuments = await Promise.all(pendingDocuments);
    const resolvedDocumentsCount = resolvedDocuments.length;
    for (let i = 0; i < resolvedDocumentsCount; i++) {
      documents = documents.concat(resolvedDocuments[i]);
    }
    return documents;
  }

  async getSharepointFolderFilesGraph (
    driveId: string,
    folderName: string,
  ): Promise<Array<SharepointFile>> {
    const { accessToken } = await this.msalProvider.getGraphClientToken();

    try {
      return await this.traverseFolders(driveId, folderName, accessToken);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException(
          {
            code: 'REQUEST_FOLDER_FAILED',
            title: 'Error requesting sharepoint files',
            detail: `Error while constructing request for Sharepoint folder files`,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  /***
   * Retrieves a list of files in a given Sharepoint folder
   * @param {string} folderIdentifier - the relative URL for the document location.
   * E.g.
   *   - for packages: "dcp_package/2021M0371_PAS Package_2_92A42B7BAC4EEB11A811001DD83093A3"
   *     this is constructed from the package's Document Location 'relativeurl' property
   *   - for artifacts: "dcp_artifacts/https://nyco365.sharepoint.com/sites/dcppfsuat2/dcp_artifacts/2022Q0155 - Test File for ZA - 1_2C0C20A49656EB11A812001DD830A1E2"
   *     this is constructed from the artifact's 'dcp_artifactdocumentlocation' property
   *      This isn't a true relative url, but the function below handles this special case by extracting the relative url portion
   */
  async getSharepointFolderFiles(
    folderIdentifier,
    path = "Files",
    method = "post"
  ): Promise<any> {
    try {
      console.log("getSharepointFolderFiles")
      console.log("folder ider", folderIdentifier)
      const { access_token } = await this.generateSharePointAccessToken();

      // For Artifacts, folderIdentifier is an absolute URL instead of a relative url, so we extract it
      // by spltting folderIdentifier with the environment token (e.g. 'dcppfsuat2')
      const SHAREPOINT_CRM_SITE = this.config.get("SHAREPOINT_CRM_SITE");
      let [, relativeUrl] = folderIdentifier.split(SHAREPOINT_CRM_SITE);

      // If there's no relative url extracted, it means folderIdentifier was
      // a true relative url (from a Package) to begin with. So we
      // use the original folderIdentifier
      if (!relativeUrl) {
        relativeUrl = folderIdentifier;
      }

      const url = encodeURI(
        `https://nyco365.sharepoint.com/sites/${SHAREPOINT_CRM_SITE}/_api/web/GetFolderByServerRelativeUrl('/sites/${SHAREPOINT_CRM_SITE}/${relativeUrl}')/${path}`
      );
      const options = {
        url,
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json"
        }
      };

      return new Promise((resolve, reject) => {
        Request[method](options, (error, response, body) => {
          if (error) return;
          const stringifiedBody = body.toString("utf-8");
          if (response.statusCode >= 400) {
            reject(
              new HttpException(
                {
                  code: "LOAD_FOLDER_FAILED",
                  title: "Error loading sharepoint files",
                  detail: `Could not load file list from Sharepoint folder "${url}". ${stringifiedBody}`
                },
                HttpStatus.NOT_FOUND
              )
            );
          }
          const folderFiles = JSON.parse(stringifiedBody);
          console.log({folderFiles})

          resolve([
            ...(folderFiles["Files"] ? folderFiles["Files"] : []),
            ...(folderFiles["Folders"] ? unnest(folderFiles["Folders"]) : [])
          ]);
        });
      });
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException(
          {
            code: "REQUEST_FOLDER_FAILED",
            title: "Error requesting sharepoint files",
            detail: `Error while constructing request for Sharepoint folder files`
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
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
    console.log("getSharepointFile")
    const { access_token } = await this.generateSharePointAccessToken();
    const SHAREPOINT_CRM_SITE = this.config.get("SHAREPOINT_CRM_SITE");

    // see https://docs.microsoft.com/en-us/previous-versions/office/sharepoint-server/dn775742(v=office.15)
    const url = `https://nyco365.sharepoint.com/sites/${SHAREPOINT_CRM_SITE}/_api/web/GetFileByServerRelativeUrl('/${serverRelativeUrl}')/$value?binaryStringResponseBody=true`;
    const options = {
      url,
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    };

    // this returns a pipeable stream
    return Request.get(options).on("error", e => console.log(e));
  }

  async deleteSharepointFile(serverRelativeUrl): Promise<any> {
    const { access_token } = await this.generateSharePointAccessToken();
    const SHAREPOINT_CRM_SITE = this.config.get("SHAREPOINT_CRM_SITE");
    const url = `https://nyco365.sharepoint.com/sites/${SHAREPOINT_CRM_SITE}/_api/web/GetFileByServerRelativeUrl('${serverRelativeUrl}')`;

    const options = {
      url,
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/json",
        "X-HTTP-Method": "DELETE"
      }
    };

    return new Promise<void>(resolve => {
      Request.del(options, (error, response, body) => {
        const stringifiedBody = body.toString("utf-8");
        if (response.statusCode >= 400) {
          console.log("error", stringifiedBody);
        }

        resolve();
      });
    });
  }
}
