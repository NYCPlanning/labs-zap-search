import DS from 'ember-data';
import { attr, hasMany } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';

const { Model } = DS;

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
  // Many Actions to One Project
  @hasMany('action') actions;

  // Many Users to Many Projects
  @hasMany('user') users;

  // Many userProjectParticipation to One Project
  @hasMany('userProjectParticipation') userProjectParticipants;

  @attr() applicantteam;

  // array of applicant objects
  @attr() applicants;

  @attr('string') dcp_name;

  @attr() dcp_applicanttype;

  @attr() dcp_borough;

  @attr('string') dcp_ceqrnumber;

  @attr() dcp_ceqrtype;

  @attr('string') dcp_certifiedreferred;

  @attr('boolean') dcp_femafloodzonea;

  @attr('boolean') dcp_femafloodzonecoastala;

  @attr('boolean') dcp_femafloodzoneshadedx;

  @attr('boolean') dcp_femafloodzonev;

  @attr('string') dcp_projectbrief;

  @attr('string') dcp_projectname;

  @attr() dcp_publicstatus_simp;

  @attr() dcp_hiddenprojectmetrictarget;

  @attr('string') dcp_ulurp_nonulurp;

  @attr() dcp_communitydistrict;

  @attr('string') dcp_communitydistricts;

  @attr('string') dcp_validatedcommunitydistricts;

  @attr('boolean') has_centroid;

  @attr() bbls;

  @attr({ defaultValue: () => EmptyFeatureCollection })
  bbl_featurecollection

  @attr() milestones;

  @attr() addresses;

  @attr() keywords;

  @attr() ulurpnumbers;

  @attr() center;

  @attr() lastmilestonedate;

  @attr() video_links;

  @computed('bbl_featurecollection')
  get bblFeatureCollectionSource() {
    const data = this.bbl_featurecollection;
    return {
      type: 'geojson',
      data,
    };
  }
}
