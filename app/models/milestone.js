import DS from 'ember-data';

const {
  Model, attr, belongsTo,
} = DS;

// --> <CRM/ZAP-API>:<field> indicates which CRM or ZAP-API field the Model attribute maps to.
export default class MilestoneModel extends Model {
  @belongsTo('project') project;

  // --> ZAP-API:zap_id
  // --> CRM:dcp_projectmilestone. e.g. 923BEEC4-DAD0-E711-8116-1458D04E2FB8
  // This is the Milestone ID that identifies a specific milestone
  @attr('string') projectMilestone;

  // --> CRM:dcp_name. e.g. 'ZC - Land Use Fee Payment '
  @attr('string') name;

  // --> CRM:milestonename | e.g. 'Land Use Fee Payment'
  @attr('string') milestoneName;

  // --> CRM:dcp_plannedstartdate | e.g. '2018-10-31T01:21:46'
  @attr('string') plannedStartDate;

  // --> CRM:dcp_plannedcompletiondate | e.g. '2018-11-02T01:21:46'
  @attr('string') plannedCompletionDate;

  // --> CRM:dcp_actualstartdate | e.g. '2018-05-11T04:00:00'
  @attr('string') actualStartDate;

  // --> CRM:dcp_actualenddate | e.g. '2018-05-12T04:00:00'
  @attr('string') actualEndDate;

  // --> CRM:statuscode | e.g. 'Not Started', 'In Progress', 'Completed', 'Overridden'
  @attr('string') statusCode;

  // --> CRM:dcp_milestonesequence | e.g. 28
  @attr('string') milestoneSequence;

  // --> ZAP-API:displayDescription | e.g. 'Land Use Fee Payment'
  @attr('string') displayDescription;

  // --> CRM:display_name | e.g. 'Land Use Fee Payment'
  @attr('string') displayName;

  // --> CRM:display_date | e.g. '2018-10-31T01:21:46'
  @attr('string') displayDate;

  // --> CRM:display_date_2 | e.g. null
  @attr('string') displayDate2;

  // --> CRM:dcp_milestoneoutcome
  @attr('string') milestoneOutcome;

  // --> ZAP-API:milestoneLinks
  @attr() milestoneLinks;
}
