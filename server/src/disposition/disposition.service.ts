import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SharepointService } from "../sharepoint/sharepoint.service";

@Injectable()
export class DispositionService {
  constructor(private readonly sharepointService: SharepointService) {}

  /**
   * @param      {string}  relativeUrl    a string representing the Sharepoint URL relative to the entity folder.
   *                                      In essence it is the Sharepoint folder name. e.g. P2015K0223_DOB Letter_3
   * @param      {Object}  dcp_name   The disposition dcp_name property.
   *                                  Used for error logging purposes.
   *
   * @return     {Object[]}     Array of 0 or more custom Document objects
   */
  async getDispositionSharepointDocuments(relativeUrl, dcp_name) {
    if (relativeUrl) {
      try {
        const documents = await this.sharepointService.getSharepointFolderFiles(
          `dcp_dispositions/${relativeUrl}`,
          "?$expand=Files,Folders,Folders/Files,Folders/Folders/Files,Folders/Folders/Folders/Files"
        );

        if (documents) {
          return documents.map(document => ({
            name: document["Name"],
            timeCreated: document["TimeCreated"],
            serverRelativeUrl: document["ServerRelativeUrl"]
          }));
        }

        return [];
      } catch (e) {
        if (e instanceof HttpException) {
          throw e;
        } else {
          const errorMessage = `An error occured while constructing and looking up folder for disposition. Perhaps the disposition name or id is wrong. ${JSON.stringify(
            e
          )}`;
          console.log(errorMessage);

          throw new HttpException(
            {
              code: "SHAREPOINT_FOLDER_ERROR",
              title: "Bad Sharepoint folder lookup",
              detail: errorMessage,
              meta: {
                relativeUrl
              }
            },
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      }
    }

    console.log(
      `Warning: Tried to load documents for an disposition but the "relativeUrl" argument was null. disposition dcp_name is "${dcp_name}"`
    );

    return [];
  }

  /**
   * Injects associated documents into the given disposition
   *
   * @param      {Object{ dcp_name, dcp_spabsoluteurl }} CRM disposition with
   *              dcp_name and dcp_spabsoluteurl properties
   * @return     {Object} The CRM disposition with the 'documents' property hydrated,
   *              if associated documents exist in CRM.
   */
  public async dispositionWithDocuments(projectDisposition: any) {
    // Unlike the package `dcp_package_SharePointDocumentLocations` property, the `dcp_spabsoluteurl`
    // property is a single-valued property, a string representing the absolute Sharepoint URL.
    // So we have to split the string to get the "relative URL" portion.
    const { dcp_name, dcp_spabsoluteurl } = projectDisposition;

    if (dcp_spabsoluteurl) {
      try {
        return {
          ...projectDisposition,
          documents: await this.getDispositionSharepointDocuments(
            dcp_spabsoluteurl,
            dcp_name
          )
        };
      } catch (e) {
        const errorMessage = `Error loading documents for disposition ${dcp_name}. ${JSON.stringify(
          e
        )}`;
        console.log(errorMessage);

        throw new HttpException(
          {
            code: "DISPOSITION_WITH_DOCUMENTS",
            title: "DISPOSITION Documents Error",
            detail: errorMessage
          },
          HttpStatus.NOT_FOUND
        );
      }
    }

    return {
      ...projectDisposition,
      documents: []
    };
  }
}
