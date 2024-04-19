import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import * as Request from "request";
import { ConfigService } from "../config/config.service";
import { MSAL, MsalProviderType } from "../provider/msal.provider";

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
export interface SharePointListDrive {
  name: string;
  drive: {
    id: string;
  };
}

export interface SharepointFile {
  id: string;
  name: string;
  createdDateTime: string;
  file?: {
    mimeType: string;
  };
  folder?: {
    childCount: number;
  };
}

// This service currently only helps you read and delete files from Sharepoint.
// If you wish to upload documents to Sharepoint through CRM,
// use the DocumentService instead.
@Injectable()
export class SharepointService {
  constructor(
    @Inject(MSAL)
    private readonly msalProvider: MsalProviderType,

    private readonly config: ConfigService
  ) {
    const driveNameMap = {
      dcp_communityboarddisposition: "Project Disposition",
      dcp_projectaction: "Project Action",
      dcp_artifact: "Artifact",
      dcp_package: "Package"
    };
    (async () => {
      const { accessToken } = await msalProvider.getGraphClientToken();
      // Files are only accessible when their parent drive id is known.
      // We obtain drive ids by their name
      // The ids are not expected to change. So, we can set them once on initialization and then reuse the results
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json"
        }
      };
      try {
        Object.entries(driveNameMap).forEach(([name, displayName]) => {
          const url = `${
            msalProvider.sharePointSiteUrl
          }/lists?$filter=displayName eq '${displayName}'&$expand=drive($select=id)&$select=name`;
          fetch(url, options).then(response =>
            response.json().then((data: { value: SharePointListDrive[] }) => {
              const {
                drive: { id }
              } = data.value[0];
              this.driveIdMap[name] = id;
            })
          );
        });
      } catch {
        throw new HttpException(
          {
            code: "INITIALIZE_DRIVE_ID",
            title: "Error initializing sharepoint drive ids",
            detail: "Could not retrieve ids for sharepoint drives"
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    })();
  }

  driveIdMap: Record<string, string> = {};

  private async traverseFolders(
    driveId: string,
    folderName: string,
    accessToken: string
  ): Promise<SharepointFile[]> {
    const url = `${
      this.msalProvider.sharePointSiteUrl
    }/drives/${driveId}/root:/${folderName}:/children?$select=id,name,file,folder,createdDateTime`;
    const options = {
      headers: {
        method: "GET",
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      }
    };
    const response = await fetch(url, options);
    const data = (await response.json()) as {
      value: SharepointFile[];
    };
    let documents: SharepointFile[] = [];
    // Create a promise for each folder that needs to be search,
    // allowing child folders to be search simultaneously
    const pendingDocuments: Array<Promise<SharepointFile[]>> = [];
    const fileCount = data.value.length;

    for (let i = 0; i < fileCount; i++) {
      const entry = data.value[i];
      if (entry.file !== undefined) {
        documents.push(entry);
      } else if (entry.folder && entry.folder.childCount > 0) {
        pendingDocuments.push(
          this.traverseFolders(
            driveId,
            `${folderName}/${entry.name}`,
            accessToken
          )
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

  async getSharepointFolderFiles(
    driveId: string,
    folderName: string
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
  async getSharepointFile(driveId: string, fileId: string): Promise<any> {
    const { accessToken } = await this.msalProvider.getGraphClientToken();

    const url = `${
      this.msalProvider.sharePointSiteUrl
    }/drives/${driveId}/items/${fileId}/content`;
    const options = {
      url,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      }
    };

    try {
      // this returns a pipeable stream
      return Request.get(options);
    } catch {
      throw new HttpException(
        {
          code: "DOWNLOAD_FILE_FAILED",
          title: "Error downloading sharepoint file",
          detail: `Error while downloading Sharepoint file`
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getSharepointFileUrl(driveId: string, fileId: string) {
    const { accessToken } = await this.msalProvider.getGraphClientToken();

    const url = `${
      this.msalProvider.sharePointSiteUrl
    }/drives/${driveId}/items/${fileId}?$select=webUrl`;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      }
    };

    const response = await fetch(url, options);
    return await response.json();
  }

  async getSharepointFileId(driveId: string, relativeUrl: string) {
    const filePathSegments = relativeUrl.split("/");
    const filePathSegmentsCount = filePathSegments.length;
    if (filePathSegmentsCount < 4)
      throw new HttpException(
        {
          code: "DISPOSITION_ID_PATH",
          title: "Disposition ID Path Error"
        },
        HttpStatus.BAD_REQUEST
      );

    const fileName = filePathSegments[filePathSegmentsCount - 1];
    // A file may be nested within several folders. We rejoin the folders into the relative path
    const folderName = filePathSegments
      .slice(2, filePathSegmentsCount - 1)
      .join("/");

    const { accessToken } = await this.msalProvider.getGraphClientToken();
    const url = `${
      this.msalProvider.sharePointSiteUrl
    }/drives/${driveId}/root:/${folderName}:/children?$filter=(name eq '${fileName}')&$select=id`;
    const options = {
      headers: {
        method: "GET",
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      }
    };

    const response = await fetch(url, options);
    const data = (await response.json()) as
      | { value: Array<{ id: string }> }
      | { message: string };
    if ("value" in data && data.value.length > 0) {
      return data.value[0].id;
    } else {
      throw new HttpException(
        {
          code: "DISPOSITION_ID_RESULT",
          title: "Disposition ID Result Error"
        },
        HttpStatus.NOT_FOUND
      );
    }
  }
}
