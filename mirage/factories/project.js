import { Factory, faker } from 'ember-cli-mirage';
import bblFeatureCollection from '../test-data/bbl-feature-collection'

export default Factory.extend({
  dcp_projectid() {
    return faker.random.uuid();
  },

  dcp_name() {
    return `
      ${faker.random.arrayElement([faker.address.streetName(), faker.company.companyName()])}
      ${faker.random.arrayElement(['Rezoning', faker.address.streetSuffix()])}
    `;
  },

  dcp_alterationmapnumber() {
    return faker.random.word();
  },

  dcp_applicant_customer() {
    return faker.company.companyName();
  },

  dcp_applicanttype() {
    return faker.random.word();
  },

  dcp_borough() {
    return faker.random.word();
  },

  dcp_bsanumber() {
    return faker.random.word();
  },

  dcp_ceqrnumber() {
    return faker.random.word();
  },

  dcp_ceqrtype() {
    return faker.random.word();
  },

  dcp_certifiedreferred() {
    return faker.date.past();
  },

  dcp_currentenvironmentmilestone() {
    return faker.random.word();
  },

  dcp_currentmilestone() {
    return faker.random.word();
  },

  dcp_decpermitnumber() {
    return faker.random.word();
  },

  dcp_easeis() {
    return faker.random.word();
  },

  dcp_femafloodzonea() {
    return faker.random.word();
  },

  dcp_femafloodzonecoastala() {
    return faker.random.word();
  },

  dcp_femafloodzoneshadedx() {
    return faker.random.word();
  },

  dcp_femafloodzonev() {
    return faker.random.word();
  },

  dcp_leadagencyforenvreview() {
    return faker.random.word();
  },

  dcp_leaddivision() {
    return faker.random.word();
  },

  dcp_lpcnumber() {
    return faker.random.word();
  },

  dcp_nydospermitnumber() {
    return faker.random.word();
  },

  dcp_previousactiononsite() {
    return faker.random.word();
  },

  dcp_projectbrief() {
    return faker.lorem.paragraph();
  },

  dcp_projectname() {
    return faker.random.word();
  },

  dcp_publicstatus() {
    return faker.random.word();
  },

  dcp_hiddenprojectmetrictarget() {
    return faker.random.word();
  },

  dcp_sischoolseat() {
    return faker.random.word();
  },

  dcp_sisubdivision() {
    return faker.random.word();
  },

  dcp_ulurp_nonulurp() {
    return faker.random.word();
  },

  dcp_wrpnumber() {
    return faker.random.word();
  },

  dcp_communitydistrict() {
    return faker.random.word();
  },

  dcp_communitydistricts() {
    return faker.random.word();
  },

  dcp_validatedcommunitydistricts() {
    return faker.random.word();
  },

  bblFeatureCollection() {
    return bblFeatureCollection;
  }

});
