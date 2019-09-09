import DS from 'ember-data';

const {
  Model, attr, belongsTo,
} = DS;

// --> <CRM/ZAP-API>:<field> indicates which CRM or ZAP-API field the Model attribute maps to.
export default class MilestoneModel extends Model {
  @belongsTo('project') project;

  // --> ZAP-API:zap_id
  // This is the Milestone ID that identifies a specific milestone
  @attr('string') milestone;

  // --> CRM:dcp_name. e.g. 'ZC - Land Use Fee Payment '
  @attr('string') name;

  // --> CRM:milestonename | e.g. 'Land Use Fee Payment'
  @attr('string') milestonename;

  // --> CRM:dcp_plannedstartdate | e.g. '2018-10-31T01:21:46'
  @attr('string') plannedstartdate;

  // --> CRM:dcp_plannedcompletiondate | e.g. '2018-11-02T01:21:46'
  @attr('string') plannedcompletiondate;

  // --> CRM:dcp_actualstartdate | e.g. '2018-05-11T04:00:00'
  @attr('string') actualstartdate;

  // --> CRM:dcp_actualenddate | e.g. '2018-05-12T04:00:00'
  @attr('string') actualenddate;

  // --> CRM:statuscode | e.g. 'Not Started', 'In Progress', 'Completed', 'Overridden'
  @attr('string') statuscode;

  // --> CRM:dcp_milestonesequence | e.g. 28
  @attr('string') milestonesequence;

  // --> ZAP-API:displayDescription | e.g. 'Land Use Fee Payment'
  @attr('string') displayDescription;

  // --> CRM:display_name | e.g. 'Land Use Fee Payment'
  @attr('string') displayName;

  // --> CRM:display_date | e.g. '2018-10-31T01:21:46'
  @attr('string') displayDate;

  // --> CRM:display_date_2 | e.g. null
  @attr('string') displayDate2;

  // --> CRM:dcp_milestoneoutcome
  @attr('string') milestoneoutcome;

  // --> ZAP-API:milestoneLinks
  @attr() milestoneLinks;
}
