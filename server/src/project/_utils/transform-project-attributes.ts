import { overwriteCodesWithLabels } from "src/crm/crm.utilities";
import { transformActions } from "./transform-actions";
import { transformMilestones } from "./transform-milestones";

export function transformProjectAttributes(project): any {
  // this must happen before value-mapping because some of the constants
  // refer to certain identifiers that are replaced after value-mapping
  project.milestones = transformMilestones(
    project.dcp_dcp_project_dcp_projectmilestone_project,
    project
  );
  project.dispositions =
    project.dcp_dcp_project_dcp_communityboarddisposition_project;

  const [valueMappedProject] = overwriteCodesWithLabels([project]);

  project.actions = transformActions(
    project.dcp_dcp_project_dcp_projectaction_project
  );

  // perform after value-mapping
  const {
    dcp_dcp_project_dcp_projectkeywords_project,
    dcp_dcp_project_dcp_projectbbl_project
  } = valueMappedProject;

  if (dcp_dcp_project_dcp_projectkeywords_project) {
    project.keywords = dcp_dcp_project_dcp_projectkeywords_project.map(
      ({ _dcp_keyword_value }) => _dcp_keyword_value
    );
  }

  if (dcp_dcp_project_dcp_projectbbl_project) {
    project.bbls = dcp_dcp_project_dcp_projectbbl_project.map(
      ({ dcp_bblnumber }) => dcp_bblnumber
    );
  }

  project.applicantteam = [
    {
      name: valueMappedProject._dcp_applicant_customer_value,
      role: "Primary Applicant"
    },
    {
      name: valueMappedProject._dcp_applicantadministrator_customer_value,
      role: "Primary Contact"
    }
  ];

  return project;
}
