import { BoroughBlock } from "../geometry/geometry.service";
import { Project } from "./get-projects-query";

/**
 * Transform ProjectBlock entities (from getProjectBlocksQuery) into
 * BoroughBlock entities to be used in carto queries
 * @param projectBlocks
 */
export function transformProjectsBlocks(
  projectBlocks: Project[]
): BoroughBlock[] {
  return (
    projectBlocks
      .reduce((boroughBlocks, projectBlock) => {
        return boroughBlocks.concat(
          projectBlock.dcp_dcp_project_dcp_projectbbl_project.map(
            projectBBL => ({
              id:
                localizeBoroughCodes(projectBBL.dcp_validatedborough) +
                projectBBL.dcp_validatedblock,
              dcp_publicstatus: projectBlock.dcp_publicstatus
            })
          )
        );
      }, [])
      // Make boroughBlocks unique so we don't get a entity too large error from carto
      .filter(
        (boroughBlock, index, _projectBlocks) =>
          index === _projectBlocks.findIndex(b => b.id === boroughBlock.id)
      )
  );
}

// these are represented as MS Dynamics CRM-specific codings in CRM, but
// when we join them to block data, they are represented differently
function localizeBoroughCodes(crmCodedBorough: number) {
  switch (crmCodedBorough) {
    case 717170000:
      return 2;
    case 717170001:
      return 1;
    case 717170002:
      return 3;
    case 717170003:
      return 4;
    case 717170004:
      return 5;
  }
}
