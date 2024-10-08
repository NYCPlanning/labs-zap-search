import { Injectable, HttpStatus, HttpException } from "@nestjs/common";
import { SharepointService } from "../sharepoint/sharepoint.service";

@Injectable()
export class ArtifactService {
  constructor(private readonly sharepointService: SharepointService) {}

  /**
   * @param      {string}  relativeUrl    a string representing the Sharepoint URL relative to the entity folder.
   *                                      In essence it is the Sharepoint folder name. e.g. P2015K0223_DOB Letter_3
   * @param      {Object}  dcp_name   The Artifact dcp_name property.
   *                                  Used for error logging purposes.
   *
   * @return     {Object[]}     Array of 0 or more custom Document objects
   */
  async getArtifactSharepointDocuments(relativeUrl, dcp_name) {
    if (relativeUrl) {
      try {
        const folderPath = relativeUrl.split("/");
        const folderName = folderPath[folderPath.length - 1];
        const documents = await this.sharepointService.getSharepointFolderFiles(
          this.sharepointService.driveIdMap.dcp_artifact,
          folderName
        );

        if (documents) {
          return documents.map(document => ({
            name: document.name,
            timeCreated: document.createdDateTime,
            serverRelativeUrl: `/${document.id}`
          }));
        }

        return [];
      } catch (e) {
        if (e instanceof HttpException) {
          throw e;
        } else {
          const errorMessage = `An error occured while constructing and looking up folder for artifact. Perhaps the artifact name or id is wrong.`;
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
      `Warning: Tried to load documents for an Artifact but the "relativeUrl" argument was null. Artifact dcp_name is "${dcp_name}"`
    );

    return [];
  }

  /**
   * Injects associated documents into the given artifact
   *
   * @param      {Object{ dcp_name, dcp_artifactdocumentlocation }} CRM Artifact with
   *              dcp_name and dcp_artifactdocumentlocation properties
   * @return     {Object} The CRM Artifact with the 'documents' property hydrated,
   *              if associated documents exist in CRM.
   */
  public async artifactWithDocuments(projectArtifact: any) {
    // Unlike the package `dcp_package_SharePointDocumentLocations` property, the `dcp_artifactdocumentlocation`
    // property is a single-valued property, a string representing the absolute Sharepoint URL.
    // So we have to split the string to get the "relative URL" portion.
    const { dcp_name, dcp_artifactdocumentlocation } = projectArtifact;

    if (dcp_artifactdocumentlocation) {
      try {
        // Example value for dcp_artifactdocumentlocation:
        // https://nyco365.sharepoint.com/sites/dcppfsuat2/dcp_artifacts/P2016K0021 - Area Map - 1_77A5253923FBE911A9BC001DD8308EF1

        return {
          ...projectArtifact,
          documents: await this.getArtifactSharepointDocuments(
            dcp_artifactdocumentlocation,
            dcp_name
          )
        };
      } catch (e) {
        const errorMessage = `Error loading documents for artifact ${dcp_name}.`;
        console.log(errorMessage);

        throw new HttpException(
          {
            code: "ARTIFACT_WITH_DOCUMENTS",
            title: "Artifact Documents Error",
            detail: errorMessage
          },
          HttpStatus.NOT_FOUND
        );
      }
    }

    return {
      ...projectArtifact,
      documents: []
    };
  }
}
