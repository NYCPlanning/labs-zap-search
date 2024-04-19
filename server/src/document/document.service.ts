import { Injectable, HttpStatus, HttpException } from "@nestjs/common";
import { CrmService } from "../crm/crm.service";
import { SharepointService } from "../sharepoint/sharepoint.service";

const PACKAGE_VISIBILITY = {
  GENERAL_PUBLIC: 717170003
};
const PACKAGE_STATUSCODE = {
  SUBMITTED: 717170012,
  CERTIFIED: 717170005,
  REVIEWED_NO_REVISIONS_REQUIRED: 717170009,
  REVIEWED_REVISIONS_REQUIRED: 717170010,
  UNDER_REVIEW: 717170013,
  FINAL_APPROVAL: 717170008
};

const ARTIFACT_VISIBILITY = {
  GENERAL_PUBLIC: 717170003
};

const ACTION_STATUSCODE = {
  ACTIVE: 1
};

const DISPOSITION_VISIBILITY = {
  GENERAL_PUBLIC: 717170003,
  LUP: 717170004
};

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
    "-",
    unhyphenatedGUID.slice(8, 12),
    "-",
    unhyphenatedGUID.slice(12, 16),
    "-",
    unhyphenatedGUID.slice(16, 20),
    "-",
    unhyphenatedGUID.slice(20)
  ].join("");
}

// Note that <folder_name> has this format:
//   <dcp_name>_<RECORDID>
//
// where dcp_name is usually the dcp_name property on the entity (e.g. package, artifact, or projectaction)
// (spaces replaced with underscores)
// and RECORDID is the package dcp_packageid property,
// or artifact dcp_artifactsid, or dcp_projectactionid, stripped of hyphens.
//
// We have assurance of this after sprint 10 EAS enhancements. See
// https://dcp-paperless.visualstudio.com/dcp-paperless-dynamics/_workitems/edit/13366
function getRecordIdFromFileUrl(url: string) {
  const urlSegments = url.split("/");
  const documentName = urlSegments[6];
  const documentSegments = documentName.split("_");
  const strippedRecordId = documentSegments[documentSegments.length - 1];

  // we need to re-insert hyphens to recreate the actual packageId, artifactId or ProjectactionId
  // TODO: Consider asking to preserve hyphens in record ID
  return hyphenateGUID(strippedRecordId);
}

function throwNoDocumentError(errorMessage) {
  console.log(errorMessage);

  throw new HttpException(
    {
      code: "DOCUMENT_GET_ERROR",
      detail: errorMessage
    },
    HttpStatus.NOT_FOUND
  );
}

@Injectable()
export class DocumentService {
  constructor(
    private readonly crmService: CrmService,
    private readonly sharepointService: SharepointService
  ) {}
  public async getPackageDocumentId(relativeUrl: string) {
    const driveId = this.sharepointService.driveIdMap.dcp_package;
    return await this.sharepointService.getSharepointFileId(
      driveId,
      relativeUrl
    );
  }
  // For info on the path param,
  // see above documentation for the getRecordIdFromDocumentPath function
  public async getPackageDocument(fileId: string) {
    const driveId = this.sharepointService.driveIdMap.dcp_package;
    const { webUrl } = await this.sharepointService.getSharepointFileUrl(
      driveId,
      fileId
    );
    const recordId = getRecordIdFromFileUrl(webUrl);

    try {
      // Only documents belonging to public, submitted packages should be accessible
      // to the public. So we make sure the requested document is associated with at least one
      // public, submitted package.
      const {
        records: [firstPackage]
      } = await this.crmService.get(
        "dcp_packages",
        `
        $select=dcp_packageid
        &$filter=dcp_packageid eq ${recordId}
        and (
          dcp_visibility eq ${PACKAGE_VISIBILITY.GENERAL_PUBLIC}
        )
        and (
          statuscode eq ${PACKAGE_STATUSCODE.SUBMITTED}
          or statuscode eq ${PACKAGE_STATUSCODE.CERTIFIED}
          or statuscode eq ${PACKAGE_STATUSCODE.REVIEWED_NO_REVISIONS_REQUIRED}
          or statuscode eq ${PACKAGE_STATUSCODE.REVIEWED_REVISIONS_REQUIRED}
          or statuscode eq ${PACKAGE_STATUSCODE.UNDER_REVIEW}
          or statuscode eq ${PACKAGE_STATUSCODE.FINAL_APPROVAL}
        )
      `
      );

      if (!firstPackage) {
        throwNoDocumentError(
          `Client attempted to retrieve document ${fileId}, but no associated public, submitted packages were found.`
        );
      }

      return await this.sharepointService.getSharepointFile(driveId, fileId);
    } catch (e) {
      throwNoDocumentError(`Unable to provide document access.`);
    }
  }

  public async getArtifactDocumentId(relativeUrl: string) {
    const driveId = this.sharepointService.driveIdMap.dcp_artifact;
    return await this.sharepointService.getSharepointFileId(
      driveId,
      relativeUrl
    );
  }

  public async getArtifactDocument(fileId: string) {
    const driveId = this.sharepointService.driveIdMap.dcp_artifact;
    const { webUrl } = await this.sharepointService.getSharepointFileUrl(
      driveId,
      fileId
    );
    const recordId = getRecordIdFromFileUrl(webUrl);

    try {
      const {
        records: [firstArtifact]
      } = await this.crmService.get(
        "dcp_artifactses",
        `
        $select=dcp_artifactsid
        &$filter=dcp_artifactsid eq ${recordId}
        and (
          dcp_visibility eq ${ARTIFACT_VISIBILITY.GENERAL_PUBLIC}
        )
      `
      );

      if (!firstArtifact) {
        throwNoDocumentError(
          `Client attempted to retrieve document ${fileId}, but no associated public, submitted artifacts were found.`
        );
      }

      return await this.sharepointService.getSharepointFile(driveId, fileId);
    } catch (e) {
      throwNoDocumentError(`Unable to provide document access.`);
    }
  }

  public async getProjectactionDocumentId(relativeUrl: string) {
    const driveId = this.sharepointService.driveIdMap.dcp_projectaction;
    return await this.sharepointService.getSharepointFileId(
      driveId,
      relativeUrl
    );
  }

  public async getProjectactionDocument(fileId: string) {
    const driveId = this.sharepointService.driveIdMap.dcp_projectaction;
    const { webUrl } = await this.sharepointService.getSharepointFileUrl(
      driveId,
      fileId
    );
    const recordId = getRecordIdFromFileUrl(webUrl);

    try {
      const {
        records: [firstProjectaction]
      } = await this.crmService.get(
        "dcp_projectactions",
        `
        $select=dcp_projectactionid
        &$filter=dcp_projectactionid eq ${recordId}
        and (
          statuscode ne ${ACTION_STATUSCODE.ACTIVE}
        )
      `
      );

      if (!firstProjectaction) {
        throwNoDocumentError(
          `Client attempted to retrieve document ${fileId}, but no associated inactive project actions were found.`
        );
      }

      return await this.sharepointService.getSharepointFile(driveId, fileId);
    } catch (e) {
      throwNoDocumentError(`Unable to provide document access.`);
    }
  }

  public async getDispositionDocumentId(relativeUrl: string) {
    const driveId = this.sharepointService.driveIdMap
      .dcp_communityboarddisposition;
    return await this.sharepointService.getSharepointFileId(
      driveId,
      relativeUrl
    );
  }

  public async getDispositionDocument(fileId: string) {
    const driveId = this.sharepointService.driveIdMap
      .dcp_communityboarddisposition;
    const { webUrl } = await this.sharepointService.getSharepointFileUrl(
      driveId,
      fileId
    );
    const recordId = getRecordIdFromFileUrl(webUrl);

    try {
      const {
        records: [firstDisposition]
      } = await this.crmService.get(
        "dcp_communityboarddispositions",
        `
        $select=dcp_communityboarddispositionid
        &$filter=dcp_communityboarddispositionid eq ${recordId}
          and (
            dcp_visibility eq ${DISPOSITION_VISIBILITY.GENERAL_PUBLIC}
            or dcp_visibility eq ${DISPOSITION_VISIBILITY.LUP}
          )
          and statecode eq 1
      `
      );

      if (!firstDisposition) {
        throwNoDocumentError(
          `Client attempted to retrieve document ${fileId}, but no associated public, submitted dispositions were found.`
        );
      }

      return await this.sharepointService.getSharepointFile(driveId, fileId);
    } catch (e) {
      throwNoDocumentError(`Unable to provide document access.`);
    }
  }
}
