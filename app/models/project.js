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

  @attr('boolean') dcp_sisubdivision;

  @attr('boolean') dcp_sischoolseat;

  @attr('string') dcp_projectbrief;

  @attr('string') dcp_projectname;

  @attr('string', { defaultValue: '' }) dcp_publicstatus_simp;

  @attr() dcp_hiddenprojectmetrictarget;

  @attr('string') dcp_ulurp_nonulurp;

  @attr() dcp_communitydistrict;

  @attr('string') dcp_communitydistricts;

  @attr('string') dcp_validatedcommunitydistricts;

  @attr('boolean') has_centroid;

  @attr() bbls;

  @attr({ defaultValue: () => EmptyFeatureCollection })
  bbl_featurecollection;

  @attr() addresses;

  @attr() keywords;

  @attr() ulurpnumbers;

  @attr() center;

  @attr() lastmilestonedate;

  @attr() video_links;

  @attr('date') actualstartdate;

  @attr('date') actualenddate;

  @attr('date') plannedstartdate;

  @attr('date') plannedcompletiondate;

  @computed('bbl_featurecollection')
  get bblFeatureCollectionSource() {
    const data = this.bbl_featurecollection;
    return {
      type: 'geojson',
      data,
    };
  }
}
