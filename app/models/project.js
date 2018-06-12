import DS from 'ember-data';
import { attr } from '@ember-decorators/data';

const { Model } = DS;

export default class ProjectModel extends Model {
  // @attr() dcp_applicant_customer; // foreign key
  // @attr() dcp_currentenvironmentmilestone; // foreign key
  // @attr() dcp_currentmilestone; // foreign key
  // @attr() dcp_leadagencyforenvreview; // foreign key

  @attr('string') dcp_projectid;
  @attr('string') dcp_name;
  @attr('string') dcp_alterationmapnumber;
  @attr() dcp_applicanttype;
  @attr() dcp_borough;
  @attr('string') dcp_bsanumber;
  @attr('string') dcp_ceqrnumber;
  @attr() dcp_ceqrtype;
  @attr('string') dcp_certifiedreferred;
  @attr('string') dcp_decpermitnumber;
  @attr() dcp_easeis;
  @attr('boolean') dcp_femafloodzonea;
  @attr('boolean') dcp_femafloodzonecoastala;
  @attr('boolean') dcp_femafloodzoneshadedx;
  @attr('boolean') dcp_femafloodzonev;
  @attr() dcp_leaddivision;
  @attr('string') dcp_lpcnumber;
  @attr('string') dcp_nydospermitnumber;
  @attr('boolean') dcp_previousactiononsite;
  @attr('string') dcp_projectbrief;
  @attr('string') dcp_projectname;
  @attr() dcp_publicstatus;
  @attr() dcp_hiddenprojectmetrictarget;
  @attr('boolean') dcp_sischoolseat;
  @attr('boolean') dcp_sisubdivision;
  @attr() dcp_ulurp_nonulurp;
  @attr('string') dcp_wrpnumber;
  @attr() dcp_communitydistrict;
  @attr('string') dcp_communitydistricts;
  @attr('string') dcp_validatedcommunitydistricts;
}
