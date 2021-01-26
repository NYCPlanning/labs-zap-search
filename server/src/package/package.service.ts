import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { SharepointService } from '../sharepoint/sharepoint.service';

@Injectable()
export class PackageService {
  constructor(
    private readonly sharepointService: SharepointService,
  ) {}

  /**
   * @param      {Object}  packageDocumentLocation   a Document Location object.
   * This is an one element acquired from the `dcp_package_SharePointDocumentLocations`
   * Navigation property array on a Package entity.
   * @return     {Object[]}     Array of 0 or more custom Document objects
  */
  async getPackageSharepointDocuments(packageDocumentLocation) {
    // relativeurl is the path url "relative to the entity".
    // In essence it is the Sharepoint folder name.
    // e.g. P2015K0223_Draft Land Use_3
    const {
      relativeurl,
      _regardingobjectid_value,
    } = packageDocumentLocation;

    if (relativeurl) {
      try {
        const documents = await this.sharepointService.getSharepointFolderFiles(`dcp_package/${relativeurl}`, '?$expand=Files,Folders,Folders/Files,Folders/Folders/Files,Folders/Folders/Folders/Files');

        if (documents) {
          return documents.map(document => ({
            name: document['Name'],
            timeCreated: document['TimeCreated'],
            serverRelativeUrl: document['ServerRelativeUrl'],
          }));
        }

        return [];
      } catch (e) {
        if (e instanceof HttpException) {
          throw e;
        } else {
          const errorMessage = `An error occured while constructing and looking up folder for package. Perhaps the package name or id is wrong. ${JSON.stringify(e)}`;
          console.log(errorMessage);

          throw new HttpException({
            code: 'SHAREPOINT_FOLDER_ERROR',
            title: 'Bad Sharepoint folder lookup',
            detail: errorMessage,
            meta: {
              relativeurl,
            }
          }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    }

    console.log(`Warning: Tried to load documents for a package but the Document Location "relativeurl" was null. Regarding object is ${_regardingobjectid_value}`);

    return [];
  }

  /**
   * Injects associated documents into the given package
   *
   * @param      {Object{ dcp_name, dcp_packageid }} CRM Package with
   *              dcp_name and dcp_packageid properties
   * @return     {Object} The CRM Package with the 'documents' property hydrated,
   *              if associated documents exist in CRM.
   */
  public async packageWithDocuments(projectPackage: any) {
    const {
      dcp_name,
      dcp_package_SharePointDocumentLocations: documentLocations,
    } = projectPackage;

    if (documentLocations && documentLocations.length > 0) {
      try {
        return {
          ...projectPackage,
          documents: await this.getPackageSharepointDocuments(documentLocations[0]),
        };
      } catch (e) {
        const errorMessage = `Error loading documents for package ${dcp_name}. ${JSON.stringify(e)}`;
        console.log(errorMessage);
  
        throw new HttpException({
          "code": "PACKAGE_WITH_DOCUMENTS",
          "title": "Package Documents Error",
          "detail": errorMessage,
        }, HttpStatus.NOT_FOUND);
      }
    }

    if (documentLocations === null) {
      console.log(`Warning: Tried to load documents for the Package "${dcp_name}", but no dcp_package_SharePointDocumentLocations was null.`);
    }

    return {
      ...projectPackage,
      documents: [],
    }
  }
}
