import DS from 'ember-data';

const {
  Model, attr, belongsTo, hasMany,
} = DS;

export default class ActionModel extends Model {
// DB table: dcp_projectaction

  // One Project has Many Actions
  @belongsTo('project', { async: true }) project;

  // ONE disposition has many action
  @hasMany('disposition') dispositions;

  // id sourced from dcp_action, unique action IDs--e.g. '566ede3a-dad0-e711-8125-1458d04e2f18'
  @attr('string') dcpAction;

  // Name of action e.g. "Zoning Text Amendment"
  // sourced from dcp_name -- SUBSTRING(a.dcp_name FROM '-{1}\s*(.*)')
  @attr('string') dcpName;

  // Action Code e.g. "ZR"
  // sourced from CRM: dcp_name -- SUBSTRING(a.dcp_name FROM '^(\w+)')
  @attr('string') actioncode;

  // sourced from dcp_name-- e.g. 'ZR - Zoning Text Amendment'
  // STRING_AGG(DISTINCT SUBSTRING(actions.dcp_name FROM '^(\\w+)'), ';') AS actiontypes
  // list of action types separated by semicolon for dropdown selection
  // @attr('string') actionType;

  // sourced from statuscode
  // e.g. "Active", "Approved", "Certified", "Referred", "Terminated", "Withdrawn"
  @attr('string', { defaultValue: '' }) statuscode;

  // sourced from statecode
  // "Active" vs. "Inactive" projects
  @attr('string') statecode;

  // sourced from dcp_ulurpnumber
  @attr('string') dcpUlurpnumber;

  // sourced from dcp_zoningresolution
  @attr('string') dcpZoningresolution;

  // sourced from dcp_ccresolutionnumber
  @attr('string') dcpCcresolutionnumber;

  unknownProperty(key) {
    console.log(`Unexpected access of ${key} on ${this}`);
  }
}
