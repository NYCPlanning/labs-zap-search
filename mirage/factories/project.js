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
    return faker.random.number();
  },

  dcp_applicant_customer() {
    return faker.company.companyName();
  },

  dcp_applicanttype() {
    return faker.random.arrayElement(['Private', 'Other Public Agency', 'DCP']);
  },

  dcp_borough() {
    return faker.random.arrayElement(['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island']);
  },

  dcp_bsanumber() {
    return faker.random.number();
  },

  dcp_ceqrnumber() {
    return faker.random.number();
  },

  dcp_ceqrtype() {
    return faker.random.arrayElement(['Type I', 'Type II', 'Unlisted']);
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
    return faker.random.number();
  },

  dcp_easeis() {
    return faker.random.word();
  },

  dcp_femafloodzonea() {
    return faker.random.arrayElement(['Flood Zone A', '']);
  },

  dcp_femafloodzonecoastala() {
    return faker.random.arrayElement(['Coastal Flood Zone', '']);
  },

  dcp_femafloodzoneshadedx() {
    return faker.random.arrayElement(['Shaded Flood Zone X','']);
  },

  dcp_femafloodzonev() {
    return faker.random.arrayElement(['Flood Zone V', '']);
  },

  dcp_leadagencyforenvreview() {
    return faker.commerce.department();
  },

  dcp_leaddivision() {
    return faker.commerce.department();
  },

  dcp_lpcnumber() {
    return faker.random.number();
  },

  dcp_nydospermitnumber() {
    return faker.random.number();
  },

  dcp_previousactiononsite() {
    return faker.random.word();
  },

  dcp_projectbrief() {
    return faker.lorem.sentences();
  },

  dcp_projectname() {
    return faker.random.word();
  },

  dcp_publicstatus() {
    return faker.random.arrayElement(['Active', 'Approved', 'Withdrawn']);
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
    return faker.random.arrayElement(['ULURP', 'Non-ULURP']);
  },

  dcp_wrpnumber() {
    return faker.random.number();
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

  bbl_featurecollection() {
    return bblFeatureCollection;
  }

});
