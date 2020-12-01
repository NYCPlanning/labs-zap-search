export const transformProjects = (projects) => {
  return projects.map(project => ({
    applicants: project._dcp_applicant_customer_value,
    applicantteam: [{
      name: project._dcp_applicant_customer_value,
      role: 'Primary Applicant',
    }, {
      name: project._dcp_applicantadministrator_customer_value,
      role: 'Primary Contact',
    }],
    has_centroid: !!project.dcp_dcp_project_dcp_projectbbl_project.length,
    ...project,
  }));
};
