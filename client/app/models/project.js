import DS from 'ember-data';
import { computed } from '@ember/object';
import { sort, alias } from '@ember/object/computed';
import { DCP_APPLICABILITY_OPTIONSET } from './project/constants';
import {
  STATUSCODE_OPTIONSET,
} from './milestone/constants';


const {
  Model, attr, hasMany,
} = DS;

const EmptyFeatureCollection = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: null,
    properties: {
      isEmptyDefault: true,
    },
  }],
};

const milestoneDateCompare = function(prev, next) {
  if (prev.dcpActualstartdate && !next.dcpActualstartdate) return -1;
  if (!prev.dcpActualstartdate && next.dcpActualstartdate) return 1;

  const prevMilestoneDate = new Date(prev.dcpActualstartdate);
  const nextMilestoneDate = new Date(next.dcpActualstartdate);

  return prevMilestoneDate.getTime() - nextMilestoneDate.getTime();
};

export default class ProjectModel extends Model {
  @hasMany('action', { async: false }) actions;

  @hasMany('milestone', { async: false }) milestones;

  @hasMany('disposition', { async: false }) dispositions;

  @hasMany('assignment', { async: false }) assignments;

  @hasMany('package', { async: false })
  packages;

  @hasMany('artifact', { async: false })
  artifacts;

  @attr() applicantteam;

  // array of applicant objects
  @attr() applicants;

  @attr('string') dcpName;

  @attr() dcpApplicanttype;

  @attr() dcpBorough;

  @attr('string') dcpCeqrnumber;

  @attr() dcpCeqrtype;

  @attr('string') dcpCertifiedreferred;

  @attr('boolean') dcpFemafloodzonea;

  @attr('boolean') dcpFemafloodzoneshadedx;

  @attr('boolean') dcpSisubdivision;

  @attr('boolean') dcpSischoolseat;

  @attr('string') dcpProjectbrief;

  @attr('string') dcpAdditionalpublicinformation;

  @attr('string') dcpProjectname;

  @attr('string') dcpProjectid;

  @attr('string', { defaultValue: '' }) dcpPublicstatus;

  // @attr('string', { defaultValue: '' }) dcpPublicstatusSimp;
  @alias('dcpPublicstatus')
  dcpPublicstatusSimp;

  @attr('string') dcpProjectcompleted;

  @attr() dcpHiddenprojectmetrictarget;

  @attr('string') dcpUlurpNonulurp;

  @attr('string') dcpValidatedcommunitydistricts;

  @attr('boolean') hasCentroid;

  @attr() dcpBsanumber;

  @attr() dcpWrpnumber;

  @attr() dcpLpcnumber;

  @attr() dcpNydospermitnumber;

  @attr() bbls;

  @attr({ defaultValue: () => EmptyFeatureCollection })
  bblFeaturecollection;

  @attr() addresses;

  @attr() keywords;

  @attr() ulurpnumbers;

  @attr() center;

  @attr() dcpLastmilestonedate;

  @attr() videoLinks;

  @attr() dcpApplicability;

  @attr() dcpNoticeddate;

  @computed('dcpApplicability')
  get dcpApplicabilitySimp() {
    const option = Object.values(DCP_APPLICABILITY_OPTIONSET).find(applicability => applicability.label === this.dcpApplicability);
    if (option) {
      return option.altLabel;
    }

    return 'Unknown';
  }

  @computed('bblFeaturecollection')
  get bblFeatureCollectionSource() {
    const data = this.bblFeaturecollection;
    return {
      type: 'geojson',
      data,
    };
  }

  @computed('packages')
  get sortedPackages() {
    return this.packages.sortBy('dcpPackagesubmissiondate')
      .reverse();
  }

  @computed('artifacts')
  get sortedArtifacts() {
    return this.artifacts.sortBy('modifiedon')
      .reverse();
  }

  /**
   *    We need to filter out the following:
   *    If the project id starts with a 'P' (this.dcpName[0]):
   *       Then filter out "Review Filed EAS" and "Review Filed Land Use Application"
   *    Otherwise:
   *       Filter out "Prepare Filed EAS" and "Prepare Filed Land Use Application"
   */
  @computed('milestones', 'dcpName')
  get filteredMilestones() {
    return this.get('milestones')
      .filter(pMilestone => (
        !((this.dcpName[0] === 'P') && (['Review Filed EAS', 'Review Filed Land Use Application'].includes(pMilestone.milestonename)))
        && !((this.dcpName[0] !== 'P') && (['Prepare Filed EAS', 'Prepare Filed Land Use Application'].includes(pMilestone.milestonename)))
      ));
  }

  @computed('filteredMilestones')
  get completedMilestones() {
    return this.get('filteredMilestones')
      .filter(pMilestone => pMilestone.statuscode === STATUSCODE_OPTIONSET.COMPLETED.label);
  }

  @computed('filteredMilestones')
  get inProgressMilestones() {
    return this.get('filteredMilestones')
      .filter(pMilestone => pMilestone.statuscode === STATUSCODE_OPTIONSET.IN_PROGRESS.label);
  }

  @computed('filteredMilestones')
  get notStartedMilestones() {
    return this.get('filteredMilestones')
      .filter(pMilestone => ((pMilestone.statuscode !== STATUSCODE_OPTIONSET.COMPLETED.label) && (pMilestone.statuscode !== STATUSCODE_OPTIONSET.IN_PROGRESS.label)));
  }

  @sort('completedMilestones', milestoneDateCompare)
  sortedCompletedMilestones;

  @sort('inProgressMilestones', milestoneDateCompare)
  sortedInProgressMilestones;

  @sort('notStartedMilestones', milestoneDateCompare)
  sortedNotStartedMilestones;

  @sort('milestones', milestoneDateCompare)
  sortedMilestones;
}
