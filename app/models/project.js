import DS from 'ember-data';
import { computed } from '@ember/object';

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
  // Many Users to Many Projects
  @hasMany('user') users;

  // Many Actions to One Project
  @hasMany('action', { async: false }) actions;

  // Many Dispositions to One Project
  @hasMany('disposition', { async: false }) dispositions;

  // ONE Project Has Many User Project Participant Types
  @hasMany('userProjectParticipantType') userProjectParticipantTypes;

  @hasMany('milestone', { async: false }) milestones;

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

  @attr('boolean') dcpFemafloodzonecoastala;

  @attr('boolean') dcpFemafloodzoneshadedx;

  @attr('boolean') dcpFemafloodzonev;

  @attr('boolean') dcpSisubdivision;

  @attr('boolean') dcpSischoolseat;

  @attr('string') dcpProjectbrief;

  @attr('string') dcpProjectname;

  @attr('string', { defaultValue: '' }) dcpPublicstatusSimp;

  @attr() dcpHiddenprojectmetrictarget;

  @attr('string') dcpUlurpNonulurp;

  @attr() dcpCommunitydistrict;

  @attr('string') dcpCommunitydistricts;

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

  @attr() lastmilestonedate;

  @attr() videoLinks;

  @computed('bblFeaturecollection')
  get bblFeatureCollectionSource() {
    const data = this.bblFeaturecollection;
    return {
      type: 'geojson',
      data,
    };
  }

  unknownProperty(key) {
    console.log(`Unexpected access of ${key} on ${this}`);
  }
}
