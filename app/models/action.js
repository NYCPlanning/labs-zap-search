import DS from 'ember-data';

const {
  Model, attr, hasMany, belongsTo,
} = DS;

export default class ActionModel extends Model {
// DB table: dcp_projectaction

  // One Project has Many Actions
  @belongsTo('project') project;

  // Many Actions to Many Recommendations
  // Participants can submit ONE recommendation per action or ONE recommendation for all actions in a project
  @hasMany('recommendation', { inverse: 'actions' }) recommendations;

  // id sourced from dcp_action, unique action IDs--e.g. '566ede3a-dad0-e711-8125-1458d04e2f18'
  @attr('string') actionId;

  // Name of action e.g. "Zoning Text Amendment"
  // sourced from dcp_name --> SUBSTRING(a.dcp_name FROM '-{1}\s*(.*)')
  @attr('string') actionName;

  // Action Code e.g. "ZR"
  // sourced from dcp_name --> SUBSTRING(a.dcp_name FROM '^(\w+)')
  @attr('string') actionCode;

  // sourced from dcp_name-- e.g. 'ZR - Zoning Text Amendment'
  // STRING_AGG(DISTINCT SUBSTRING(actions.dcp_name FROM '^(\\w+)'), ';') AS actiontypes
  // list of action types separated by semicolon for dropdown selection
  // @attr('string') actionType;

  // sourced from statuscode
  // e.g. "Active", "Approved", "Certified", "Referred", "Terminated", "Withdrawn"
  @attr('string') status;

  // sourced from statecode
  // "Active" vs. "Inactive" projects
  @attr('string') isActive;

  // sourced from dcp_ulurpnumber
  @attr('string') ulurpNumber;

  // sourced from dcp_zoningresolution
  @attr('string') zoningResolution;

  // sourced from dcp_ccresolutionnumber
  @attr('string') ccResolutionNumber;
}
