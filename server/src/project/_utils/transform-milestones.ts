// IDs of Milestones that should be sent to the client
export const VISIBLE_MILESTONES = [
  "963beec4-dad0-e711-8116-1458d04e2fb8",
  "943beec4-dad0-e711-8116-1458d04e2fb8",
  "763beec4-dad0-e711-8116-1458d04e2fb8",
  "a63beec4-dad0-e711-8116-1458d04e2fb8",
  "923beec4-dad0-e711-8116-1458d04e2fb8",
  "9e3beec4-dad0-e711-8116-1458d04e2fb8",
  "9c3beec4-dad0-e711-8116-1458d04e2fb8",
  "a23beec4-dad0-e711-8116-1458d04e2fb8",
  "a43beec4-dad0-e711-8116-1458d04e2fb8",
  "863beec4-dad0-e711-8116-1458d04e2fb8",
  "7c3beec4-dad0-e711-8116-1458d04e2fb8",
  "7e3beec4-dad0-e711-8116-1458d04e2fb8",
  "883beec4-dad0-e711-8116-1458d04e2fb8",
  "783beec4-dad0-e711-8116-1458d04e2fb8",
  "aa3beec4-dad0-e711-8116-1458d04e2fb8",
  "823beec4-dad0-e711-8116-1458d04e2fb8",
  "663beec4-dad0-e711-8116-1458d04e2fb8",
  "6a3beec4-dad0-e711-8116-1458d04e2fb8",
  "a83beec4-dad0-e711-8116-1458d04e2fb8",
  "843beec4-dad0-e711-8116-1458d04e2fb8",
  "8e3beec4-dad0-e711-8116-1458d04e2fb8",
  "780593bb-ecc2-e811-8156-1458d04d0698",
  "723beec4-dad0-e711-8116-1458d04e2fb8",
  "6c3beec4-dad0-e711-8116-1458d04e2fb8",

  // these are study area entities and
  // TODO: need to also check for study
  // area flag
  "483beec4-dad0-e711-8116-1458d04e2fb8",
  "4a3beec4-dad0-e711-8116-1458d04e2fb8"
];

// TODO: filter milestones by whether the project have study action
// function hasStudyAction(milestone, project) {}
function applyDisplayDescriptions(milestone, project) {
  const mutatedMilestone = milestone;

  if (
    milestone._dcp_milestone_value === "963beec4-dad0-e711-8116-1458d04e2fb8" &&
    project.dcp_ulurp_nonulurp === 717170001
  )
    milestone.display_description =
      "The Borough Board has 30 days concurrent with the Borough President’s review period to review the application and issue a recommendation.";

  if (
    milestone._dcp_milestone_value === "943beec4-dad0-e711-8116-1458d04e2fb8" &&
    project.dcp_ulurp_nonulurp === 717170001
  )
    milestone.display_description =
      "The Borough President has 30 days after the Community Board issues a recommendation to review the application and issue a recommendation.";

  if (
    milestone._dcp_milestone_value === "a63beec4-dad0-e711-8116-1458d04e2fb8" &&
    project.dcp_ulurp_nonulurp === 717170001
  )
    milestone.display_description =
      "The City Council has 50 days from receiving the City Planning Commission report to call up the application, hold a hearing and vote on the application.";

  if (
    milestone._dcp_milestone_value === "a63beec4-dad0-e711-8116-1458d04e2fb8" &&
    project.dcp_ulurp_nonulurp === 717170000
  )
    milestone.display_description =
      "The City Council reviews text amendments and a few other non-ULURP items.";

  if (
    milestone._dcp_milestone_value === "923beec4-dad0-e711-8116-1458d04e2fb8" &&
    project.dcp_ulurp_nonulurp === 717170001
  )
    milestone.display_description =
      "The Community Board has 60 days from the time of referral (nine days after certification) to hold a hearing and issue a recommendation.";

  if (
    milestone._dcp_milestone_value === "923beec4-dad0-e711-8116-1458d04e2fb8" &&
    project.dcp_ulurp_nonulurp === 717170000
  )
    milestone.display_description =
      "The City Planning Commission refers to the Community Board for 30, 45 or 60 days.";

  if (
    milestone._dcp_milestone_value === "9e3beec4-dad0-e711-8116-1458d04e2fb8" &&
    project.dcp_ulurp_nonulurp === 717170001
  )
    milestone.display_description =
      "The City Planning Commission has 60 days after the Borough President issues a recommendation to hold a hearing and vote on an application.";

  if (
    milestone._dcp_milestone_value === "9e3beec4-dad0-e711-8116-1458d04e2fb8" &&
    project.dcp_ulurp_nonulurp === 717170000
  )
    milestone.display_description =
      "The City Planning Commission does not have a clock for non-ULURP items. It may or may not hold a hearing depending on the action.";

  if (milestone._dcp_milestone_value === "7c3beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_description =
      "A Draft Scope of Work must be recieved 30 days prior to the Public Scoping Meeting.";

  if (milestone._dcp_milestone_value === "883beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_description =
      "A Final Environmental Impact Statement (FEIS) must be completed ten days prior to the City Planning Commission vote.";

  if (
    milestone._dcp_milestone_value === "aa3beec4-dad0-e711-8116-1458d04e2fb8" &&
    project.dcp_ulurp_nonulurp === 717170000
  )
    milestone.display_description =
      "For many non-ULURP actions this is the final action and record of the decision.";

  if (
    milestone._dcp_milestone_value === "a83beec4-dad0-e711-8116-1458d04e2fb8" &&
    project.dcp_ulurp_nonulurp === 717170001
  )
    milestone.display_description =
      "The Mayor has five days to review the City Councils decision and issue a veto.";

  if (milestone._dcp_milestone_value === "843beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_description =
      "A Draft Environmental Impact Statement must be completed prior to the City Planning Commission certifying or referring a project for public review.";

  if (
    milestone._dcp_milestone_value === "8e3beec4-dad0-e711-8116-1458d04e2fb8" &&
    project.dcp_ulurp_nonulurp === 717170001
  )
    milestone.display_description =
      'A "Review Session" milestone signifies that the application has been sent to the City Planning Commission (CPC) and is ready for review. The "Review" milestone represents the period of time (up to 60 days) that the CPC reviews the application before their vote.';

  if (
    milestone._dcp_milestone_value === "8e3beec4-dad0-e711-8116-1458d04e2fb8" &&
    project.dcp_ulurp_nonulurp === 717170000
  )
    milestone.display_description =
      'A "Review Session" milestone signifies that the application has been sent to the City Planning Commission and is ready for review. The City Planning Commission does not have a clock for non-ULURP items. It may or may not hold a hearing depending on the action.';

  return mutatedMilestone;
}

function transformDisplayName(milestone) {
  if (milestone._dcp_milestone_value === "963beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name = "Borough Board Review";
  if (milestone._dcp_milestone_value === "943beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name = "Borough President Review";
  if (milestone._dcp_milestone_value === "763beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name = "CEQR Fee Paid";
  if (milestone._dcp_milestone_value === "a63beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name = "City Council Review";
  if (milestone._dcp_milestone_value === "923beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name = "Community Board Review";
  if (milestone._dcp_milestone_value === "9e3beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name = "City Planning Commission Review";
  if (milestone._dcp_milestone_value === "a43beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name = "City Planning Commission Vote";
  if (milestone._dcp_milestone_value === "9c3beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name =
      "Review Session - Pre-Hearing Review / Post Referral";
  if (milestone._dcp_milestone_value === "a23beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name = "Post Hearing Follow-Up / Future Votes";
  if (milestone._dcp_milestone_value === "863beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name =
      "Draft Environmental Impact Statement Public Hearing";
  if (milestone._dcp_milestone_value === "7c3beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name =
      "Draft Scope of Work for Environmental Impact Statement Received";
  if (milestone._dcp_milestone_value === "7e3beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name =
      "Environmental Impact Statement Public Scoping Meeting";
  if (milestone._dcp_milestone_value === "883beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name = "Final Environmental Impact Statement Submitted";
  if (milestone._dcp_milestone_value === "783beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name = "Environmental Assessment Statement Filed";
  if (milestone._dcp_milestone_value === "aa3beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name = "Approval Letter Sent to Responsible Agency";
  if (milestone._dcp_milestone_value === "823beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name =
      "Final Scope of Work for Environmental Impact Statement Issued";
  if (milestone._dcp_milestone_value === "663beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name = "Land Use Application Filed";
  if (milestone._dcp_milestone_value === "6a3beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name = "Land Use Fee Paid";
  if (milestone._dcp_milestone_value === "a83beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name = "Mayoral Review";
  if (milestone._dcp_milestone_value === "843beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name = "Draft Environmental Impact Statement Completed";
  if (milestone._dcp_milestone_value === "8e3beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name =
      "Application Reviewed at City Planning Commission Review Session";
  if (milestone._dcp_milestone_value === "780593bb-ecc2-e811-8156-1458d04d0698")
    milestone.display_name =
      "City Planning Commission Review of City Council Modification";
  if (milestone._dcp_milestone_value === "483beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name = "DEIS Scope of Work Released";
  if (milestone._dcp_milestone_value === "4a3beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name =
      "Environmental Impact Statement Public Scoping Meeting";
  if (milestone._dcp_milestone_value === "6c3beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name = "Land Use Application Filed";
  if (milestone._dcp_milestone_value === "723beec4-dad0-e711-8116-1458d04e2fb8")
    milestone.display_name = "Environmental Assessment Statement Filed";

  return milestone;
}

function transformDisplaySequence(milestone) {
  milestone.display_sequence = milestone.dcp_milestonesequence;

  if (milestone._dcp_milestone_value === "780593bb-ecc2-e811-8156-1458d04d0698")
    milestone.display_sequence = 58; // what is this?

  return milestone;
}

function transformAliases(milestone) {
  // Use the raw labeled formatted value
  milestone.milestonename =
    milestone["_dcp_milestone_value@OData.Community.Display.V1.FormattedValue"];

  // TODO: This may need to be the _formatted version of the field
  // Please check which one it is. It needs to be the labeled version.
  milestone.outcome = milestone._dcp_milestoneoutcome_value
    ? milestone[
        "_dcp_milestoneoutcome_value@OData.Community.Display.V1.FormattedValue"
      ]
    : null;
  milestone.dcp_milestone = milestone._dcp_milestone_value;

  return milestone;
}

function filterMilestonesForDisplay(milestone) {
  return VISIBLE_MILESTONES.includes(milestone._dcp_milestone_value);
}

function sortMilestones(prev, next) {
  const displaySequenceDifference =
    prev.display_sequence - next.display_sequence;

  return displaySequenceDifference;
}

export const transformMilestones = (milestones, project) => {
  return milestones
    .filter(filterMilestonesForDisplay)
    .map(milestone => applyDisplayDescriptions(milestone, project))
    .map(milestone => transformDisplayName(milestone))
    .map(milestone => transformDisplaySequence(milestone))
    .map(milestone => transformAliases(milestone))
    .sort(sortMilestones);
};
