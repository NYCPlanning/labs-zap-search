import { SharepointFile } from "src/sharepoint/sharepoint.service";

export class SharepointServiceMock {
  driveIdMap = {
    dcp_communityboarddisposition: "Project Disposition",
    dcp_projectaction: "Project Action",
    dcp_artifact: "Artifact",
    dcp_package: "Package"
  };

  async getSharepointFolderFiles(
    driveId: string,
    folderUrl: string
  ): Promise<Array<SharepointFile>> {
    return [
      {
        id: driveId,
        name: folderUrl,
        createdDateTime: "now"
      }
    ];
  }

  async deleteSharepointFile(fileIdPath: string) {
    return fileIdPath;
  }
}
