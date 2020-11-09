import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';

@Injectable()
export class DocumentService {
  constructor(
    private readonly crmService: CrmService,
  ){}

  // We retrieve documents from the Sharepoint folder (`folderIdentifier` in the
  // code below) that holds both documents from past revisions and the current
  // revision. CRM automatically carries over documents from past revisions into
  // this folder, and we deliberately upload documents for the latest/current
  // revision into this folder.
  async findPackageSharepointDocuments(packageName, id: string) {
    try {
      const strippedPackageName = packageName.replace(/-/g, '').replace(/\s+/g, '').replace(/'+/g, '').replace(/^\~|\#|\%|\&|\*|\{|\}|\\|\:|\<|\>|\?|\/|\||\"/g, '');
      const folderIdentifier = `${strippedPackageName}_${id.toUpperCase().replace(/-/g, '')}`;

      const { value: documents } = await this.crmService.getSharepointFolderFiles(`dcp_package/${folderIdentifier}`);

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
        throw new HttpException({
          code: 'SHAREPOINT_FOLDER_ERROR',
          title: 'Bad Sharepoint folder lookup',
          detail: `An error occured while constructing and looking up folder for package. Perhaps the package name or id is wrong.`,
          meta: {
            packageName: packageName,
            packageId: id,
          }
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


  /**
   * Injects associated documents into the given package
   *
   * @param      {Object{ dcp_name, dcp_packageid }} CRM Package with
   *              dcp_name and dcp_packageid properties
   * @return     {[Object]} The CRM Package with the 'documents' property hydrated,
   *              if associated documents exist in CRM.
   */
  public async packageWithDocuments(projectPackage: any) {
    const {
      dcp_name,
      dcp_packageid,
    } = projectPackage;

    try {
      return {
        ...projectPackage,
        documents: await this.findPackageSharepointDocuments(dcp_name, dcp_packageid),
      };
    } catch {
      const errorMessage = `Error loading documents for package ${dcp_name}.`;
      console.log(errorMessage);

      throw new HttpException({
        "code": "PACKAGE_WITH_DOCUMENTS",
        "title": "Package Documents Error",
        "detail": errorMessage,
      }, HttpStatus.NOT_FOUND);
    }
  }
}
