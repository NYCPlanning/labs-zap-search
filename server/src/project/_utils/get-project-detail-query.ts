import buildQuery from "odata-query";
import { PROJECT_VISIBILITY_LOOKUP } from "../project.service";

class ProjectDetail {
  dcp_projectid: string = "";
  dcp_name: string = "";
  dcp_applicanttype: string = "";
  dcp_borough: string = "";
  dcp_ceqrnumber: string = "";
  dcp_ceqrtype: string = "";
  dcp_certifiedreferred: string = "";
  dcp_femafloodzonea: string = "";
  dcp_femafloodzoneshadedx: string = "";
  dcp_sisubdivision: string = "";
  dcp_sischoolseat: string = "";
  dcp_projectbrief: string = "";
  dcp_projectname: string = "";
  dcp_publicstatus: string = "";
  dcp_projectcompleted: string = "";
  dcp_hiddenprojectmetrictarget: string = "";
  dcp_ulurp_nonulurp: string = "";
  dcp_validatedcommunitydistricts: string = "";
  dcp_bsanumber: string = "";
  dcp_wrpnumber: string = "";
  dcp_lpcnumber: string = "";
  dcp_nydospermitnumber: string = "";
  dcp_lastmilestonedate: string = "";
  _dcp_applicant_customer_value: string = "";
  _dcp_applicantadministrator_customer_value: string = "";
  // joins, not for selecting, so no default value
  dcp_dcp_project_dcp_projectmilestone_project: any;
  dcp_dcp_project_dcp_communityboarddisposition_project: any;
  dcp_dcp_project_dcp_projectaction_project: any;
  dcp_dcp_project_dcp_projectbbl_project: any;
  dcp_dcp_project_dcp_projectkeywords_project: any;
  dcp_dcp_project_dcp_projectaddress_project: any;
}

export const getProjectDetailQuery = (name: string) =>
  buildQuery<ProjectDetail>({
    select: Object.getOwnPropertyNames(
      new ProjectDetail()
    ) as (keyof ProjectDetail)[],
    filter: [
      { dcp_name: name },
      { dcp_visibility: PROJECT_VISIBILITY_LOOKUP["General Public"] }
    ],
    expand: [
      {
        dcp_dcp_project_dcp_projectmilestone_project: {
          select: [
            "dcp_milestone",
            "dcp_name",
            "dcp_plannedstartdate",
            "dcp_plannedcompletiondate",
            "dcp_actualstartdate",
            "dcp_actualenddate",
            "statuscode",
            "dcp_milestonesequence",
            "dcp_remainingplanneddayscalculated",
            "dcp_remainingplanneddays",
            "dcp_goalduration",
            "dcp_actualdurationasoftoday",
            "_dcp_milestone_value",
            "_dcp_milestoneoutcome_value",
            "dcp_reviewmeetingdate"
          ],
          filter: {
            not: { statuscode: 717170001 }
          }
        }
      },
      { dcp_dcp_project_dcp_communityboarddisposition_project },
      {
        dcp_dcp_project_dcp_projectaction_project: {
          filter: { not: { statuscode: 717170003 } },
          select: [
            "_dcp_action_value",
            "dcp_name",
            "statuscode",
            "statecode",
            "dcp_ulurpnumber",
            "_dcp_zoningresolution_value",
            "dcp_ccresolutionnumber",
            "dcp_spabsoluteurl"
          ]
        }
      },
      {
        dcp_dcp_project_dcp_projectbbl_project: {
          filter: [
            // TODO: add filter to exclude inactives
            { statuscode: 1 },
            { not: { dcp_validatedblock: null } }
          ],
          select: "dcp_bblnumber"
        }
      },
      {
        dcp_dcp_project_dcp_projectkeywords_project: {
          select: ["dcp_name", "_dcp_keyword_value"]
        }
      },
      // TODO: confirm if this is included (there may be a limit to 5 expansions)
      {
        dcp_dcp_project_dcp_projectaddress_project: {
          select: ["dcp_name"]
        }
      }
    ]
  });
