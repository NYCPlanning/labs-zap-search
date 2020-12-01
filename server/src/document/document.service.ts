import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';

const PACKAGE_VISIBILITY = {
  GENERAL_PUBLIC: 717170003,
}
const PACKAGE_STATUSCODE = {
  SUBMITTED: 717170012,
}

const ARTIFACT_VISIBILITY = {
  GENERAL_PUBLIC: 717170003,
}

// Inserts hyphens into an unhyphenated GUID string
// e.g. 
// 996699F37323EB11A813001DD8309FA8 
// becomes
// 996699F3-7323-EB11-A813-001DD8309FA8
//
// https://docs.microsoft.com/en-us/dynamics-nav/guid-data-type
function hyphenateGUID(unhyphenatedGUID) {
  return [
    unhyphenatedGUID.slice(0, 8),
    '-',
    unhyphenatedGUID.slice(8, 12),
    '-',
    unhyphenatedGUID.slice(12,16),
    '-',
    unhyphenatedGUID.slice(16,20),
    '-',
    unhyphenatedGUID.slice(20),
  ].join('');
}

// NOTE: There are no guarantees that Filed Land Use documents will show up until we have secured Sprint 10 enhancements from the EAS team.
// This is because there have been instances that the dcpName portion for Filed LU is stripped of hyphens and spaces.
// After that, we can also consider updating the app to read document locations.
function stripDcpName(dcpName) {
  return dcpName.replace(/'+/g, '').replace(/^\~|\#|\%|\&|\*|\{|\}|\\|\:|\<|\>|\?|\/|\||\"/g, '');
}

function constructFolderIdentifier(dcpName, recordId) {
  return `${dcpName}_${recordId.toUpperCase().replace(/-/g, '')}`;
}

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
      const strippedPackageName = stripDcpName(packageName);
      const folderIdentifier = constructFolderIdentifier(strippedPackageName, id);

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
        const errorMessage = `An error occured while constructing and looking up folder for package. Perhaps the package name or id is wrong. ${JSON.stringify(e)}`;
        console.log(errorMessage);

        throw new HttpException({
          code: 'SHAREPOINT_FOLDER_ERROR',
          title: 'Bad Sharepoint folder lookup',
          detail: errorMessage,
          meta: {
            packageName: packageName,
            packageId: id,
          }
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async findArtifactSharepointDocuments(artifactName, id: string) {
    try {
      const strippedArtifactName = stripDcpName(artifactName);
      const folderIdentifier = constructFolderIdentifier(strippedArtifactName, id);

      const { value: documents } = await this.crmService.getSharepointFolderFiles(`dcp_artifacts/${folderIdentifier}`);

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

  // "path" refers to the "relative server path", the path
  // to the file itself on the sharepoint host. It has the format
  //
  //   /sites/<site>/<entity_name>/<folder_name>/filename.pdf
  //
  // For example,
  //
  //   /sites/dcpuat2/dcp_package/2021M0268_DraftEAS_1_996699F37323EB11A813001DD8309FA8/EAS%20Full%20Form.pdf
  //
  // Note that <folder_name> has this format:
  //
  //   <dcp_name>_<RECORDID>
  //
  // where dcp_name is the dcp_name property on the package or artifact
  // (spaces replaced with underscores)
  // and RECORDID is the package dcp_packageid property,
  // or artifact dcp_artifactsid, stripped of hyphens.
  //
  // We will have assurance of this after sprint 10 EAS enhancements. See
  // https://dcp-paperless.visualstudio.com/dcp-paperless-dynamics/_workitems/edit/13366
  public async getPublicPackageOrArtifactDocument(path) {
    const pathSegment = path[0];
    const folder = pathSegment.split('/')[3];
    const folderSegments = folder.split('_');
    const strippedRecordId = folderSegments[folderSegments.length - 1];

    // we need to re-insert hyphens to recreate the actual packageId or artifactId
    // TODO: Consider asking to preseve hyphens in record ID
    const recordId = hyphenateGUID(strippedRecordId);

    try {
      // Only documents belonging to public, submitted packages should be accessible
      // to the public. So we make sure the requested document is associated with at least one
      // public, submitted package.
      const { records: [firstPackage] } = await this.crmService.get('dcp_packages', `
        $select=dcp_packageid
        &$filter=dcp_packageid eq ${recordId}
        and (
          dcp_visibility eq ${PACKAGE_VISIBILITY.GENERAL_PUBLIC}
        )
        and (
          statuscode eq ${PACKAGE_STATUSCODE.SUBMITTED}
        )
      `);

      // We can't determine whether the record id pertains to a Package
      // or Artifact until we try to query either one.
      // So if firstPackage is undefined, we then attempt to retrieve an
      // Artifact
      if (!firstPackage) {
        const { records: [firstArtifact] } = await this.crmService.get('dcp_artifactses', `
          $select=dcp_artifactsid
          &$filter=dcp_artifactsid eq ${recordId}
          and (
            dcp_visibility eq ${ARTIFACT_VISIBILITY.GENERAL_PUBLIC}
          )
        `);

        // If the record GUID also returns no Artifact, then there may be
        // something wrong with the GUID 
        if (!firstArtifact) {
          const errorMessage = `No document access.`;
          console.log(`Client attempted to retrieve document ${pathSegment}, but no associated public, submitted packages or artifacts were found.`);

          throw new HttpException({
            "code": "NO_DOCUMENT_ACCESS",
            "detail": errorMessage,
          }, HttpStatus.NOT_FOUND);
        }
      }

      return await this.crmService.getSharepointFile(pathSegment);
    } catch(e) {
      const errorMessage = `Unable to provide document access. ${JSON.stringify(e)}`;
      console.log(errorMessage);

      throw new HttpException({
        "code": "DOCUMENT_GET_ERROR",
        "detail": errorMessage,
      }, HttpStatus.NOT_FOUND);
    }
  }
}
