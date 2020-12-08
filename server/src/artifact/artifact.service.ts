import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { DocumentService } from '../document/document.service';
import { SharepointService } from '../sharepoint/sharepoint.service';

@Injectable()
export class ArtifactService {
  constructor(
    private readonly documentService: DocumentService,
    private readonly sharepointService: SharepointService,
  ) {}
  async findArtifactSharepointDocuments(artifactName, id: string) {
    try {
      const strippedArtifactName = this.documentService.stripDcpName(artifactName);
      const folderIdentifier = this.documentService.constructFolderIdentifier(strippedArtifactName, id);

      const { value: documents } = await this.sharepointService.getSharepointFolderFiles(`dcp_artifacts/${folderIdentifier}`);

      if (documents) {
        return documents.map(document => ({
          name: document['Name'],
          timeCreated: document['TimeCreated'],
          serverRelativeUrl: document['ServerRelativeUrl'],
        }));
      }

      return [];
    } catch (e) {
      // Relay errors from crmService 
      if (e instanceof HttpException) {
        throw e;
      } else {
        const errorMessage = `An error occured while constructing and looking up folder for artifact. Perhaps the artifact name or id is wrong. ${JSON.stringify(e)}`;
        console.log(errorMessage);

        throw new HttpException({
          code: 'SHAREPOINT_FOLDER_ERROR',
          title: 'Bad Sharepoint folder lookup',
          detail: errorMessage,
          meta: {
            artifactName: artifactName,
            artifactsId: id,
          }
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  /**
   * Injects associated documents into the given artifact
   *
   * @param      {Object{ dcp_name, dcp_artifactsid }} CRM Artifact with
   *              dcp_name and dcp_artifactsid properties
   * @return     {[Object]} The CRM Artifact with the 'documents' property hydrated,
   *              if associated documents exist in CRM.
   */
  public async artifactWithDocuments(projectArtifact: any) {
    const {
      dcp_name,
      dcp_artifactsid,
    } = projectArtifact;

    try {
      return {
        ...projectArtifact,
        documents: await this.findArtifactSharepointDocuments(dcp_name, dcp_artifactsid),
      };
    } catch (e) {
      const errorMessage = `Error loading documents for artifact ${dcp_name}. ${JSON.stringify(e)}`;
      console.log(errorMessage);

      throw new HttpException({
        "code": "PACKAGE_WITH_DOCUMENTS",
        "title": "Artifact Documents Error",
        "detail": errorMessage,
      }, HttpStatus.NOT_FOUND);
    }
  }
}
