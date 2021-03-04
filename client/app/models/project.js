import DS from 'ember-data';
import { computed } from '@ember/object';
import { sort, alias } from '@ember/object/computed';

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

  @sort('milestones', function(prev, next) {
    const milestoneSequenceDifference = prev.dcpMilestonesequence - next.dcpMilestonesequence;

    if (milestoneSequenceDifference === 0) {
      if (!prev.displayDate) return 1;

      if (!next.displayDate) return -1;

      return prev.displayDate - next.displayDate;
    }

    return milestoneSequenceDifference;
  })
  sortedMilestones;
}
