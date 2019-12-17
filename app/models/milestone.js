import DS from 'ember-data';
import { computed } from '@ember/object';

const {
  Model, attr, belongsTo,
} = DS;

// --> <CRM/ZAP-API>:<field> indicates which CRM or ZAP-API field the Model attribute maps to.
export default class MilestoneModel extends Model {
  @belongsTo('project') project;

  // --> ZAP-API:zap_id
  // This is the Milestone ID that identifies a specific milestone
  @attr('string') dcpMilestone;

  // --> CRM:dcp_name. e.g. 'ZC - Land Use Fee Payment '
  @attr('string') dcpName;

  // --> CRM:milestonename | e.g. 'Land Use Fee Payment'
  @attr('string') milestonename;

  // --> CRM:dcp_plannedstartdate | e.g. '2018-10-31T01:21:46'
  @attr('string') dcpPlannedstartdate;

  // --> CRM:dcp_plannedcompletiondate | e.g. '2018-11-02T01:21:46'
  @attr('string') dcpPlannedcompletiondate;

  // --> CRM:dcp_actualstartdate | e.g. '2018-05-11T04:00:00'
  @attr('string') dcpActualstartdate;

  // --> CRM:dcp_actualenddate | e.g. '2018-05-12T04:00:00'
  @attr('string') dcpActualenddate;

  // --> CRM:statuscode | e.g. 'Not Started', 'In Progress', 'Completed', 'Overridden'
  @attr('string') statuscode;

  // --> CRM:dcp_milestonesequence | e.g. 28
  @attr('string') dcpMilestonesequence;

  // --> ZAP-API:displayDescription | e.g. 'Land Use Fee Payment'
  @attr('string') displayDescription;

  // --> CRM:display_name | e.g. 'Land Use Fee Payment'
  @attr('string') displayName;

  // --> CRM:display_date | e.g. '2018-10-31T01:21:46'
  @attr('string') displayDate;

  // --> CRM:display_date_2 | e.g. null
  @attr('string') displayDate2;

  // field `dcp_remainingplanneddayscalculated` from table dcp_projectmilestone
  // represents number of days e.g. `8`
  @attr('string') dcpRemainingplanneddays;

  // field `dcp_goalduration` from table dcp_projectmilestone
  // represents number of days e.g. `29`
  @attr('string') dcpGoalduration;

  // --> CRM:dcp_milestoneoutcome.dcp_name
  @attr('string') outcome;

  // --> ZAP-API:milestoneLinks
  @attr() milestoneLinks;

  // In list of milestones with same displayName,
  // each milestone AFTER the first will have `Revised` before the name (isRevised === true)
  // milestones are already sorted in the backend by date
  @computed('project.milestones', 'id', 'displayName')
  get isRevised() {
    const projectMilestones = this.get('project.milestones');
    const currentMilestoneList = projectMilestones.filter(m => m.displayName === this.displayName);
    // check if the current milestone id matches the first in the list
    return this.id !== currentMilestoneList.firstObject.id;
  }

  // New milestone name based on isRevised
  @computed('isRevised', 'displayName')
  get orderSensitiveName() {
    if (this.isRevised) return `Revised ${this.displayName}`;
    return this.displayName;
  }
}
